<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }"> 首页 </el-breadcrumb-item>
      <el-breadcrumb-item> 用户管理 </el-breadcrumb-item>
      <el-breadcrumb-item> 用户列表 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 作用域插槽 -->
          <template v-slot="table">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in table.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(table.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(table.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(table.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="table">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditRole(table.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRole(table.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(table.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑角色的对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="editRoleDialogVisible"
        width="50%"
      >
        <!-- 内容主体区 -->
        <el-form
          :model="editRoleForm"
          :rules="editRoleFormRules"
          ref="editRoleFormRef"
          label-width="70px"
        >
          <!-- 角色名称 -->
          <el-form-item label="角色名称">
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>

          <!-- 角色描述 -->
          <el-form-item label="角色描述">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="editRoleDialogVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限的对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="setRightDialogClosed"
      >
        <!-- 内容主体区 -->
        <el-form ref="setRightFormRef" label-width="70px">
          <!-- 树形空间 -->
          <el-tree
            :data="rightsList"
            :props="treeProps"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="defKeys"
            ref="treeRef"
          ></el-tree>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="setRightDialogVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "Roles",
  data() {
    return {
      //所有角色列表数据
      rolesList: [],
      //当前即将分配权限的角色id
      roleId: "",
      //所有权限的数据
      rightsList: [],
      //数形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      //默认选中的节点Id值数组
      defKeys: [],
      //显示编辑角色对话框
      editRoleDialogVisible: false,
      //显示分配权限的对话框
      setRightDialogVisible: false,
      editRoleForm: {},
      editRoleFormRules: {},
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.rolesList = res.data;
    },
    async showEditRole(id) {
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200)
        return this.$message.error("查询角色信息失败！");
      this.editRoleForm = res.data;
      this.editRoleDialogVisible = true;
    },
    //编辑角色
    async editRole() {
      const { data: res } = await this.$http.put(
        `roles/${this.editRoleForm.roleId}`,
        this.editRoleForm
      );
      if (res.meta.status !== 200)
        return this.$message.error("修改角色信息失败！");
      this.getRolesList();
      this.editRoleDialogVisible = false;
      this.$message.success("编辑角色信息成功！");
    },
    async deleteRole(id) {
      //弹框询问用户是否删除数据
      const confirmRes = await this.$confirm(
        "此操作将永久删除该用户信息, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //如果用户确认删除，则返回值为字符串 confirm
      //如果用户取消删除，则返回字符串 cancel
      if (confirmRes !== "confirm") {
        return this.$message.info("您已取消删除");
      }

      //确认删除
      const { data: res } = await this.$http.delete(`roles/${id}`);
      if (res.meta.status !== 200) this.$message.error("删除用户信息失败！");

      this.$message.success("您已删除该角色信息");
      this.getRolesList();
    },

    //根据Id删除对应的权限
    async removeRightById(role, rightId) {
      //弹框提示用户是否删除
      const confirmRes = await this.$confirm(
        "此操作将永久删除该权限，是否继续",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);
      if (confirmRes !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败!");
      }
      this.$message.success("删除权限成功!");
      //this.getRolesList 防止页面刷新，避免使用
      role.children = res.data;
      console.log(res.data);
    },

    //展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      //获取所有权限的数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限信息失败！");
      //把获取到的权限保存到data中
      this.rightsList = res.data;
      //递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    //通过递归的形式获取角色下所有三级权限的Id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      //如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    //监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },
    //为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      );
      if (res.meta.status !== 200) return this.$message.error("分配权限失败！");
      this.$message.success("分配权限成功！");
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.el-tag {
  margin: 20px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>

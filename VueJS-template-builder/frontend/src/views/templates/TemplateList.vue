<template>
  <div class="template-list">
    <div class="page-header">
      <h1>Form Templates</h1>
      <el-button type="primary" @click="$router.push('/templates/new')">
        Create Template
      </el-button>
    </div>
    
    <el-card shadow="hover" class="container">
      <el-table
        v-loading="loading"
        :data="templates"
        style="width: 100%"
        empty-text="No templates found. Create your first template!"
      >
        <el-table-column prop="name" label="Name" min-width="180">
          <template #default="{ row }">
            <router-link :to="`/templates/${row._id}`">{{ row.name }}</router-link>
          </template>
        </el-table-column>
        
        <el-table-column prop="description" label="Description" min-width="250" />
        
        <el-table-column label="Elements" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ row.elements?.length || 0 }} elements</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="Status" width="120">
          <template #default="{ row }">
            <el-tag :type="row.isPublished ? 'success' : 'info'">
              {{ row.isPublished ? 'Published' : 'Draft' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="Actions" width="200">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" @click="$router.push(`/templates/${row._id}`)">
                Edit
              </el-button>
              <el-button size="small" type="primary" @click="$router.push(`/templates/${row._id}/preview`)">
                Preview
              </el-button>
              <el-button size="small" type="danger" @click="confirmDelete(row)">
                Delete
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog
      v-model="dialogVisible"
      title="Confirm Delete"
      width="30%"
    >
      <span>Are you sure you want to delete the template "{{ templateToDelete?.name }}"?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="danger" @click="deleteTemplate">Delete</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

export default {
  name: 'TemplateList',
  
  setup() {
    const store = useStore()
    const dialogVisible = ref(false)
    const templateToDelete = ref(null)
    
    const templates = computed(() => store.getters.templates)
    const loading = computed(() => store.getters.isLoading)
    
    onMounted(async () => {
      await store.dispatch('fetchTemplates')
    })
    
    const confirmDelete = (template) => {
      templateToDelete.value = template
      dialogVisible.value = true
    }
    
    const deleteTemplate = async () => {
      try {
        await store.dispatch('deleteTemplate', templateToDelete.value._id)
        ElMessage({
          message: `Template "${templateToDelete.value.name}" deleted successfully`,
          type: 'success'
        })
        dialogVisible.value = false
        templateToDelete.value = null
      } catch (error) {
        ElMessage.error('Failed to delete template')
      }
    }
    
    return {
      templates,
      loading,
      dialogVisible,
      templateToDelete,
      confirmDelete,
      deleteTemplate
    }
  }
}
</script>

<style scoped>
.template-list {
  max-width: 1200px;
  margin: 0 auto;
}
</style>

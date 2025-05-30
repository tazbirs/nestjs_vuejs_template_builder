<template>
  <div class="form-list">
    <div class="page-header">
      <h1>Forms</h1>
      <el-button type="primary" @click="$router.push('/forms/new')">
        Create Form
      </el-button>
    </div>
    
    <el-card shadow="hover" class="container">
      <el-table
        v-loading="loading"
        :data="forms"
        style="width: 100%"
        empty-text="No forms found. Create your first form!"
      >
        <el-table-column prop="name" label="Name" min-width="180">
          <template #default="{ row }">
            <router-link :to="`/forms/${row._id}`">{{ row.name }}</router-link>
          </template>
        </el-table-column>
        
        <el-table-column prop="description" label="Description" min-width="250" />
        
        <el-table-column label="Template" width="180">
          <template #default="{ row }">
            <el-tag v-if="row.templateId" size="small" type="info">
              Based on template
            </el-tag>
            <span v-else>Custom form</span>
          </template>
        </el-table-column>
        
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
              <el-button size="small" @click="$router.push(`/forms/${row._id}`)">
                Edit
              </el-button>
              <el-button size="small" type="primary" @click="$router.push(`/forms/${row._id}/view`)">
                View
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
      <span>Are you sure you want to delete the form "{{ formToDelete?.name }}"?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="danger" @click="deleteForm">Delete</el-button>
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
  name: 'FormList',
  
  setup() {
    const store = useStore()
    const dialogVisible = ref(false)
    const formToDelete = ref(null)
    
    const forms = computed(() => store.getters.forms)
    const loading = computed(() => store.getters.isLoading)
    
    onMounted(async () => {
      await store.dispatch('fetchForms')
    })
    
    const confirmDelete = (form) => {
      formToDelete.value = form
      dialogVisible.value = true
    }
    
    const deleteForm = async () => {
      try {
        await store.dispatch('deleteForm', formToDelete.value._id)
        ElMessage({
          message: `Form "${formToDelete.value.name}" deleted successfully`,
          type: 'success'
        })
        dialogVisible.value = false
        formToDelete.value = null
      } catch (error) {
        ElMessage.error('Failed to delete form')
      }
    }
    
    return {
      forms,
      loading,
      dialogVisible,
      formToDelete,
      confirmDelete,
      deleteForm
    }
  }
}
</script>

<style scoped>
.form-list {
  max-width: 1200px;
  margin: 0 auto;
}
</style>

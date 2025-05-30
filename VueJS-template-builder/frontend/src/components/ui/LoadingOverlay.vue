<template>
  <div class="loading-overlay" :class="{ 'visible': visible }">
    <div class="loading-container">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import { Loading } from '@element-plus/icons-vue'

export default {
  name: 'LoadingOverlay',
  components: {
    Loading
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Loading...'
    }
  }
}
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.loading-overlay.visible {
  opacity: 1;
  visibility: visible;
}

.loading-container {
  text-align: center;
}

.loading-icon {
  font-size: 40px;
  color: #409EFF;
  animation: spin 1s linear infinite;
}

.loading-message {
  margin-top: 10px;
  font-size: 16px;
  color: #606266;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

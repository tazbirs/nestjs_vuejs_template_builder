<template>
  <div class="empty-state">
    <el-empty 
      :image="image" 
      :image-size="imageSize" 
      :description="description"
    >
      <template v-if="$slots.default">
        <slot></slot>
      </template>
      <template v-else-if="action">
        <el-button :type="actionType" @click="$emit('action-click')">{{ actionText }}</el-button>
      </template>
    </el-empty>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: 'No data available'
    },
    image: {
      type: String,
      default: ''
    },
    imageSize: {
      type: Number,
      default: 100
    },
    action: {
      type: Boolean,
      default: false
    },
    actionText: {
      type: String,
      default: 'Add New'
    },
    actionType: {
      type: String,
      default: 'primary'
    }
  },
  emits: ['action-click']
}
</script>

<style scoped>
.empty-state {
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

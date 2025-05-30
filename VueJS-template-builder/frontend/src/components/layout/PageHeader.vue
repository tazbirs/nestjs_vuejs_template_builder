<template>
  <div class="page-header-wrapper" :class="{ 'with-actions': $slots.actions }">
    <div class="page-header-content">
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="page-header-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.page-header-wrapper {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ebeef5;
}

.page-header-wrapper.with-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 1.75rem;
  color: #303133;
  margin: 0;
  line-height: 1.4;
}

.page-subtitle {
  margin: 0.5rem 0 0 0;
  color: #606266;
  font-size: 0.95rem;
}

.page-header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>

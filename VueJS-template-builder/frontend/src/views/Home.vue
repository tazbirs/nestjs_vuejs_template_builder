<template>
  <div class="home-page">
    <div class="hero-section">
      <h1>Form Template Builder</h1>
      <p>Create, customize, and manage form templates for your applications</p>
      
      <div class="action-buttons">
        <el-button type="primary" size="large" @click="$router.push('/templates/new')">
          Create Template
        </el-button>
        <el-button size="large" @click="$router.push('/templates')">
          View Templates
        </el-button>
      </div>
    </div>
    
    <div class="features-section">
      <h2>Features</h2>
      
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="feature-card">
            <template #header>
              <div class="feature-header">
                <i class="el-icon-document"></i>
                <h3>Template Builder</h3>
              </div>
            </template>
            <div class="feature-content">
              Design reusable form templates with a drag and drop interface
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="feature-card">
            <template #header>
              <div class="feature-header">
                <i class="el-icon-edit"></i>
                <h3>Form Creation</h3>
              </div>
            </template>
            <div class="feature-content">
              Create forms based on templates with customizable fields
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="feature-card">
            <template #header>
              <div class="feature-header">
                <i class="el-icon-view"></i>
                <h3>Preview & Publish</h3>
              </div>
            </template>
            <div class="feature-content">
              Preview forms before publishing and share with your users
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <div class="getting-started">
      <h2>Getting Started</h2>
      <el-steps :active="1" simple>
        <el-step title="Create Template" description="Design a reusable form template"></el-step>
        <el-step title="Add Form Elements" description="Add and configure form elements"></el-step>
        <el-step title="Build Forms" description="Create forms based on your templates"></el-step>
        <el-step title="Publish & Share" description="Make your forms available to users"></el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 3rem 1rem;
  margin-bottom: 2rem;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #409EFF;
}

.hero-section p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: #606266;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.features-section, .getting-started {
  margin-bottom: 3rem;
}

.features-section h2, .getting-started h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.feature-card {
  height: 100%;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-header {
  display: flex;
  align-items: center;
}

.feature-header i {
  font-size: 1.5rem;
  margin-right: 10px;
  color: #409EFF;
}

.feature-content {
  color: #606266;
}
</style>

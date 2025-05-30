<template>
  <div id="app">
    <el-config-provider>
      <header class="app-header">
        <el-menu mode="horizontal" router>
          <div class="logo-container">
            <img alt="Form Builder Logo" src="./assets/logo.png" class="logo">
            <h1>Form Template Builder</h1>
          </div>
          <el-menu-item index="/">Home</el-menu-item>
          <el-menu-item index="/templates">Templates</el-menu-item>
          <el-menu-item index="/forms">Forms</el-menu-item>
        </el-menu>
      </header>
      
      <main class="app-main">
        <router-view />
      </main>
      
      <footer class="app-footer">
        <p>&copy; {{ new Date().getFullYear() }} Form Template Builder</p>
      </footer>
    </el-config-provider>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f4f7fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background-color: #ffffff;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #eaeaea;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-right: 30px;
}

.logo {
  height: 30px;
  margin-right: 10px;
}

/* Container styling */
.container {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.page-header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

<template>
  <aside class="sidebar">
    <div class="brand">
      <i class="fas fa-user-tie"></i>
      <span>MFAvaliação</span>
    </div>

    <nav class="menu">
      <a href="#" class="active">
        <i class="fas fa-chart-line"></i>
        <span>Dashboard</span>
      </a>
    </nav>

    <div class="footer">
      <small>&copy; 2025 - MFGESTSOFT</small>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  background: #0d6efd;
  color: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 1.2rem;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}
.menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}
.menu a {
  color: #fff;
  padding: 0.75rem;
  border-radius: 6px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s;
}
.menu a:hover, .menu a.active {
  background: rgba(255,255,255,0.2);
}
.footer {
  text-align: center;
  padding: 1rem;
  font-size: 0.8rem;
  opacity: 0.8;
}
</style>

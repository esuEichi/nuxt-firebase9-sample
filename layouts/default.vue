<template>
  <div>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#">mtg portal</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown text="spellslingers" right>
              <b-dropdown-item href="/spellslingers/decks">deck list</b-dropdown-item>
              <b-dropdown-item href="/spellslingers/post">deck post</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <div id="content">
      <Nuxt />
    </div>
  </div>
</template>
<script setup lang="ts">
// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
</script>
<style scoped>
#content {
  max-width: 1200px;
  padding: 0 12px;
}
</style>

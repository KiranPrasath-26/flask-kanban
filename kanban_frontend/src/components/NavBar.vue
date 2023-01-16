<script setup>
import { useAuthStore } from '@/stores/AuthStore';
import { useAlertStore } from '@/stores/AlertStore'

const AuthStore = useAuthStore();
const AlertStore = useAlertStore();
</script>

<template>
  <div class="navbar bg-base-100 shadow-xl rounded-lg sticky top-1 z-20">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
        </label>
        <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
          <li><router-link to="/dashboard">Dashboard</router-link></li>
          <li><router-link to="/lists">Lists</router-link></li>
          <li><router-link to="/add-list">Add List</router-link></li>
          <li><router-link to="/add-card">Add Card</router-link></li>
          <li><router-link to="/exportlist">Export List</router-link></li>
        </ul>
      </div>
    </div>
    <div class="navbar-center">
      <a class="btn btn-ghost normal-case text-xl">KanbanApp</a>
    </div>
    <div class="navbar-end gap-x-2">
      
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-left-square-fill" viewBox="0 0 16 16"> <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm8.096-10.803L6 9.293V6.525a.5.5 0 0 0-1 0V10.5a.5.5 0 0 0 .5.5h3.975a.5.5 0 0 0 0-1H6.707l4.096-4.096a.5.5 0 1 0-.707-.707z"/> </svg>
        </label>
        <ul
            tabindex="0"
            class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
        >
            <li>
                <router-link to="/infouser">User Info</router-link>
            </li>
            <li>
                <router-link to="/login" @click="AuthStore.logout()">Logout</router-link>
            </li>
        </ul>
    </div>
    </div>
  </div>
</template>
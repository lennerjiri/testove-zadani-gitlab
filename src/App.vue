<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <h1>Gitlab User-Lister</h1>
    <nav>
      <input type="text" placeholder="Group Id" />
      <input type="text" placeholder="User Token" />
      <button>
        <p>List Groups</p>
        <font-awesome-icon icon="fa-regular fa-list" />
      </button>
      <button>
        <p>Restart</p>
        <font-awesome-icon icon="fa-regular fa-arrows-rotate" />
      </button>
    </nav>
  </header>

  <RouterView />
</template>

<style lang="scss" scoped>
header {
  font-family: "Barlow", sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);

  h1 {
    font-size: 1.5rem;
  }

  nav {
    display: flex;
    align-items: center;
    gap: 1rem;

    input {
      padding: 0.5rem;
      border: 0.125rem solid #ccc;
      border-radius: 0.25rem;
      min-width: 20rem;
      font-size: 1.15rem;

      &:focus {
        outline: none;
        border-color: #333;
      }
    }

    button {
      padding: 0.5rem 1rem;
      border: 0.125rem solid #ccc;
      border-radius: 0.25rem;
      font-size: 1.15rem;

      display: flex;
      align-items: center;
      gap: 1rem;

      cursor: pointer;
      transition: all 100ms ease-in-out;
    }
  }
}
</style>

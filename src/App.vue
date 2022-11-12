<script setup></script>

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
  <main>
    <!-- Err -->
    <section class="main__err" v-if="false">
      <p>Incorect group Id</p>
    </section>
    <!-- Overview -->
    <section class="main__group-info">
      <p>Group Name: {{}}</p>
      <p>Total Users: {{}}</p>
    </section>
    <!-- Main -->
    <section class="main__users-info">
      <div class="users-info__user-data">
        <h2 class="user-data__name">Name: {{}}</h2>
        <p class="user-data__username">Username: {{}}</p>
        <div class="user-data__user-groups-container">
          <h3>Groups:</h3>
          <ul>
            <li>
              <font-awesome-icon icon="fa-regular fa-user-group" />
              <div>
                <p class="group-name">Group Name: {{}}</p>
                <div class="group-auth">
                  <p>Group Autorization:</p>
                  <p class="group-auth__role">Edit</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="user-data__user-projects-container">
          <h3>Projects:</h3>
          <ul>
            <li>
              <font-awesome-icon icon="fa-regular fa-layer-group" />
              <div>
                <p class="project-name">Group Name: {{}}</p>
                <div class="project-auth">
                  <p>Group Autorization:</p>
                  <p class="project-auth__role">Edit</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
  <footer>Jiří Lenner - 2022</footer>
</template>

<style lang="scss" scoped>
// Variables
$box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.205);

header {
  font-family: "Barlow", sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;

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

main {
  height: calc(100vh - 8rem);
  overflow-y: scroll;

  .main__err {
    padding: 1.5rem;
    background-color: #f0aeae;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    font-size: 1.15rem;
    font-family: "Barlow", sans-serif;
    color: rgb(210, 0, 0);
    box-shadow: $box-shadow;
  }

  .main__group-info {
    padding: 1.5rem;
    background-color: #f5f5f5;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    font-size: 1.15rem;
    font-family: "Barlow", sans-serif;
    box-shadow: $box-shadow;
  }

  .main__users-info {
    padding: 4rem;

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
    gap: 3rem;

    font-size: 1.15rem;
    font-family: "Barlow", sans-serif;

    .users-info__user-data {
      padding: 1.5rem;

      border-radius: 0.25rem;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
        rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;

      display: flex;
      flex-direction: column;
      gap: 1rem;

      .user-data__name {
        font-size: 1.5rem;
      }

      .user-data__username {
        font-size: 1.25rem;
      }

      .user-data__user-groups-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        h3 {
          font-size: 1.25rem;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          box-sizing: border-box;
          padding: 1rem;
          border-radius: 0.25rem;
          background-color: #f5f5f5;

          li {
            display: flex;
            align-items: center;
            gap: 1.5rem;

            font-size: 1.15rem;

            svg {
              font-size: 1.35rem;
            }

            div {
              display: flex;
              flex-direction: column;
              gap: 0.25rem;

              > .group-name {
                font-size: 1.25rem;
              }

              > .group-auth {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 1rem;

                > .group-auth__role {
                  font-size: 1.15rem;
                  padding: 0.5rem 1rem;
                  background-color: rgba(64, 255, 0, 0.302);
                  border-radius: 100rem;
                }
              }
            }
          }
        }
      }

      .user-data__user-projects-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        h3 {
          font-size: 1.25rem;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          box-sizing: border-box;
          padding: 1rem;
          border-radius: 0.25rem;
          background-color: #f5f5f5;

          li {
            display: flex;
            align-items: center;
            gap: 1.5rem;

            font-size: 1.15rem;

            svg {
              font-size: 1.35rem;
            }

            div {
              display: flex;
              flex-direction: column;
              gap: 0.25rem;

              > .project-name {
                font-size: 1.25rem;
              }

              > .project-auth {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 1rem;

                > .project-auth__role {
                  font-size: 1.15rem;
                  padding: 0.5rem 1rem;
                  background-color: rgba(64, 255, 0, 0.302);
                  border-radius: 100rem;
                }
              }
            }
          }
        }
      }
    }
  }
}

footer {
  height: 2.4rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: $box-shadow;
  font-family: "Barlow", sans-serif;
}
</style>

<script setup>
import { ref } from "vue";

// Input
const groupId = ref("");
const userToken = ref("");

// Flags
const error = ref(false);
const loading = ref(false);
const loaded = ref(false);

// Output Data
const topLvlGroupName = ref("");
const allGroups = ref([]);
const allMembers = ref([]);
const allProjects = ref([]);

// Retrieve data using credentials from the input
const submit = async () => {
  // Clear data
  error.value = false;
  loaded.value = false;
  loading.value = true;
  topLvlGroupName.value = "";

  // Group data
  allGroups.value = [];
  allMembers.value = [];
  allProjects.value = [];

  // Check Input
  if (groupId.value === "" || userToken.value === "") {
    error.value = true;
    loading.value = false;
    return;
  }

  // Get correct access level function -> used later on to get text message for number
  const access_level = (access_level) => {
    switch (access_level) {
      case 10:
        return "Guest";
      case 20:
        return "Reporter";
      case 30:
        return "Developer";
      case 40:
        return "Maintainer";
      case 50:
        return "Owner";
      default:
        return "Unknown";
    }
  };

  // Data retrieving
  try {
    // Get top level group
    const topLevelGroupRes = await await fetch(
      `https://gitlab.com/api/v4/groups/${groupId.value}/`,
      {
        headers: {
          "PRIVATE-TOKEN": userToken.value,
        },
      }
    );
    const topLevelGroup = await topLevelGroupRes.json();
    topLvlGroupName.value = topLevelGroup.name;

    // get all groups
    let page = 1;
    while (true) {
      const response = await await fetch(
        `https://gitlab.com/api/v4/groups/${groupId.value}/descendant_groups?per_page=100&page=${page}`,
        {
          headers: {
            "PRIVATE-TOKEN": userToken.value,
          },
        }
      );

      if (response.status !== 200) {
        error.value = true;
        loading.value = false;
        return;
      }

      const data = await response.json();

      if (data.length === 0) {
        break;
      } else {
        allGroups.value.push(...data);

        page++;
      }
    }

    // Create members
    /// Get top level members and add them to the array
    const topLevelMembersRes = await fetch(
      `https://gitlab.com/api/v4/groups/${groupId.value}/members/`,
      {
        headers: {
          "PRIVATE-TOKEN": userToken.value,
        },
      }
    );

    const topLevelMembers = await topLevelMembersRes.json();

    for (const member of topLevelMembers) {
      allMembers.value.push({
        id: member.id,
        name: member.name,
        username: member.username,
        groups: [
          {
            path: topLevelGroup.full_path,
            access_level: access_level(member.access_level),
          },
        ],
        projects: [],
      });
    }

    /// Get subgroup members and add them to the array + check for duplicates or add new members to the array
    allGroups.value.forEach(async (group) => {
      const response = await fetch(
        `https://gitlab.com/api/v4/groups/${group.id}/members/`,
        {
          method: "GET",
          headers: {
            "PRIVATE-TOKEN": userToken.value,
          },
        }
      );

      if (response.status !== 200) {
        error.value = true;
        loading.value = false;
        return;
      } else {
        const subGroupMembers = await response.json();

        for (let i = 0; i < subGroupMembers.length; i++) {
          let foundFlag = false;

          // If already listed
          for (let j = 0; j < allMembers.value.length; j++) {
            if (subGroupMembers[i].id === allMembers.value[j].id) {
              foundFlag = true;
              allMembers.value[j].groups.push({
                path: group.full_path,
                access_level: access_level(subGroupMembers[i].access_level),
              });
            }
          }

          // If not yet listed
          if (!foundFlag) {
            allMembers.value.push({
              id: subGroupMembers[i].id,
              name: subGroupMembers[i].name,
              username: subGroupMembers[i].username,
              groups: [
                {
                  path: group.full_path,
                  access_level: access_level(subGroupMembers[i].access_level),
                },
              ],
              projects: [],
            });
          }
        }
      }
    });

    // Add Projects
    // Get top level projects + add them to the array
    const topLevelProjectsRes = await fetch(
      `https://gitlab.com/api/v4/groups/${groupId.value}/projects/`,
      {
        headers: {
          "PRIVATE-TOKEN": userToken.value,
        },
      }
    );

    const topLevelProjectsData = await topLevelProjectsRes.json();
    allProjects.value.push(...topLevelProjectsData);

    // Get subgroups projects + add them to the array
    for (const group of allGroups.value) {
      const response = await fetch(
        `https://gitlab.com/api/v4/groups/${group.id}/projects/`,
        {
          headers: {
            "PRIVATE-TOKEN": userToken.value,
          },
        }
      );
      const projectData = await response.json();
      allProjects.value.push(...projectData);
    }

    // Add projects to members or create new members
    for (const project of allProjects.value) {
      const response = await fetch(
        `https://gitlab.com/api/v4/projects/${project.id}/members/`,
        {
          headers: {
            "PRIVATE-TOKEN": userToken.value,
          },
        }
      );

      const projectMembers = await response.json();

      for (const projectMember of projectMembers) {
        let flag = false;
        // If member exists in allMembers append values
        for (const member of allMembers.value) {
          if (member.id === projectMember.id) {
            flag = true;

            allMembers.value[allMembers.value.indexOf(member)].projects.push({
              path: project.path_with_namespace,
              access_level: access_level(projectMember.access_level),
            });
          }
        }
        // If member does not exist in allMembers create new member
        if (!flag) {
          allMembers.value.push({
            id: projectMember.id,
            name: projectMember.name,
            username: projectMember.username,
            groups: [],
            projects: [
              {
                path: project.path_with_namespace,
                access_level: access_level(projectMember.access_level),
              },
            ],
          });
        }
      }
    }

    // Reveal the table
    loading.value = false;
    loaded.value = true;
  } catch (err) {
    // If error occurs reveal error message
    error.value = true;
    loading.value = false;
  }
};

// Restart
const restart = () => {
  error.value = false;
  loading.value = false;
  loaded.value = false;
  allGroups.value = [];
  allMembers.value = [];
  allProjects.value = [];
  topLvlGroupName.value = "";

  groupId.value = "";
  userToken.value = "";
};
</script>

<template>
  <header>
    <h1>Gitlab User-Lister</h1>
    <nav>
      <input type="text" v-model="groupId" placeholder="Group Id" />
      <input type="text" v-model="userToken" placeholder="User Token" />
      <button @click="submit">
        <p>List Groups</p>
        <font-awesome-icon icon="fa-regular fa-list" />
      </button>
      <button @click="restart">
        <p>Restart</p>
        <font-awesome-icon icon="fa-regular fa-arrows-rotate" />
      </button>
    </nav>
  </header>
  <main>
    <!-- Err -->
    <section class="main__err" v-if="error">
      <p>Incorrect input!</p>
    </section>
    <!-- Err -->
    <section class="main__loading" v-if="loading">
      <p>Loading</p>
    </section>
    <!-- Overview -->
    <section class="main__group-info" v-if="loaded">
      <p><b>Group Name: </b> {{ topLvlGroupName }}</p>
      <p><b>Total Users: </b> {{ allMembers.length }}</p>
    </section>
    <!-- Main -->
    <section class="main__users-info" v-if="loaded" v>
      <div
        class="users-info__user-data"
        v-for="member of allMembers"
        :key="member.id"
      >
        <h2 class="user-data__name">Name: {{ member.name }}</h2>
        <div class="user-data__divider"></div>
        <p class="user-data__username">Username: @{{ member.username }}</p>
        <div class="user-data__user-groups-container">
          <h3>Groups:</h3>
          <ul v-if="member.groups.length !== 0">
            <li
              v-for="group of member.groups"
              :key="member.groups.indexOf(group)"
            >
              <font-awesome-icon icon="fa-regular fa-user-group" />
              <div>
                <p class="group-name"><b>Group: </b> {{ group.path }}</p>
                <div class="group-auth">
                  <p>Group Autorization:</p>
                  <p
                    class="group-auth__role"
                    :class="{
                      guest: group.access_level === 'Guest',
                      reporter: group.access_level === 'Reporter',
                      developer: group.access_level === 'Developer',
                      maintainer: group.access_level === 'Maintainer',
                      owner: group.access_level === 'Owner',
                    }"
                  >
                    {{ group.access_level }}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="user-data__user-projects-container">
          <h3>Projects:</h3>
          <ul v-if="member.projects.length !== 0">
            <li
              v-for="project of member.projects"
              :key="member.projects.indexOf(project)"
            >
              <font-awesome-icon icon="fa-regular fa-layer-group" />
              <div>
                <p class="project-name"><b>Project: </b> {{ project.path }}</p>
                <div class="project-auth">
                  <p>Project Autorization:</p>
                  <p
                    class="project-auth__role"
                    :class="{
                      guest: project.access_level === 'Guest',
                      reporter: project.access_level === 'Reporter',
                      developer: project.access_level === 'Developer',
                      maintainer: project.access_level === 'Maintainer',
                      owner: project.access_level === 'Owner',
                    }"
                  >
                    {{ project.access_level }}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
  <footer>Ji???? Lenner - 2022</footer>
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
  background-color: white;

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
  .main__loading {
    @extend .main__err;
    background-color: #aedcf0;
    color: rgb(45, 114, 203);
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

    p {
      > b {
        font-weight: 500;
      }
    }
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

      .user-data__divider {
        width: 100%;
        height: 0.1rem;
        background-color: #ccc;
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

                b {
                  font-weight: 600;
                }
              }

              > .group-auth {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 1rem;

                p:first-child {
                  font-weight: 600;
                }

                > .group-auth__role {
                  font-size: 1.15rem;
                  padding: 0.5rem 1rem;
                  border-radius: 100rem;
                }

                > .guest {
                  background-color: rgba(255, 0, 0, 0.302);
                }

                > .reporter {
                  background-color: rgba(255, 255, 0, 0.302);
                }

                > .developer {
                  background-color: rgba(0, 255, 255, 0.302);
                }

                > .maintainer {
                  background-color: rgba(0, 0, 255, 0.302);
                }

                > .owner {
                  background-color: rgba(64, 255, 0, 0.302);
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
          display: flex;
          flex-direction: column;
          gap: 1rem;

          li {
            padding: 1rem;
            background-color: #f5f5f5;
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
                b {
                  font-weight: 600;
                }
              }

              > .project-auth {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 1rem;

                p:first-child {
                  font-weight: 600;
                }

                > .project-auth__role {
                  font-size: 1.15rem;
                  padding: 0.5rem 1rem;
                  background-color: rgba(64, 255, 0, 0.302);
                  border-radius: 100rem;
                }

                > .group-auth__role {
                  font-size: 1.15rem;
                  padding: 0.5rem 1rem;
                  border-radius: 100rem;
                }

                > .guest {
                  background-color: rgba(255, 0, 0, 0.302);
                }

                > .reporter {
                  background-color: rgba(255, 255, 0, 0.302);
                }

                > .developer {
                  background-color: rgba(0, 255, 255, 0.302);
                }

                > .maintainer {
                  background-color: rgba(0, 0, 255, 0.302);
                }

                > .owner {
                  background-color: rgba(64, 255, 0, 0.302);
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
  border-top: solid 0.1rem #ccc;
  font-family: "Barlow", sans-serif;
  z-index: 1000;
}
</style>

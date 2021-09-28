<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar class="primary">
        <q-toolbar-title>
          <q-avatar>
            <q-icon name="chat" />
          </q-avatar>
          Quasar Chat UI
        </q-toolbar-title>

        <div class="q-mx-md">
          <q-toggle
            v-model="dark"
            @update:model-value="changeTheme"
            checked-icon="dark_mode"
            unchecked-icon="light_mode"
            color="black"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const $q = useQuasar()

    $q.dark.set($q.localStorage.getItem('quasar_chat_ui_dark') ?? true)

    const dark = ref($q.dark.isActive)

    const changeTheme = (value: boolean) => {
      $q.dark.set(value)
      $q.localStorage.set('quasar_chat_ui_dark', value)
    }

    return {
      dark,
      changeTheme
    }
  }
})
</script>

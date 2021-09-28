<template>
  <q-page class="row items-end q-py-lg justify-center">
    <div class="justify-center" style="width: 100%" v-if="!loading">
      <q-scroll-area
        class="row q-px-md items-end justify-center"
        :style="`height: ${$q.screen.height - (88 + 50 + 48)}px`"
        ref="chatScroll"
      >
        <q-chat-message
          v-for="message in messages"
          :key="message.id"
          :name="message.user.name"
          :avatar="message.user.avatar"
          :text="message.text"
          :stamp="timeAgo.format(message.date)"
          :sent="message.user.me"
          text-color="white"
          :bg-color="message.user.color"
        />

        <q-chat-message
          v-for="user in users.filter((user) => user.typing && !user.me)"
          :key="user.id"
          :name="user.name"
          :avatar="user.avatar"
          :bg-color="user.color"
        >
          <q-spinner-dots size="2rem" />
        </q-chat-message>
      </q-scroll-area>

      <div class="q-px-sm" style="width: 100%; max-width: 500px; margin: auto">
        <q-input
          class="q-py-md"
          rounded
          outlined
          v-model="newMessage"
          label="Write a message..."
          @keyup.enter="sendMessage"
        >
          <template v-slot:prepend>
            <q-avatar>
              <img :src="users[0].avatar" />
            </q-avatar>
          </template>

          <template v-slot:append>
            <q-btn round dense flat icon="send" @click="sendMessage" />
          </template>
        </q-input>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { QScrollArea, uid } from 'quasar'
import { defineComponent, ref, onMounted } from 'vue'
import { UserResponse, User, Quote, Message } from 'components/models'
import { api } from 'boot/axios'

const colors = [
  'red',
  'pink',
  'purple',
  'deep-purple',
  'indigo',
  'teal',
  'green',
  'light-green',
  'amber',
  'orange',
  'deep-orange',
  'brown',
  'blue-grey'
]

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const loading = ref(true)
    const users = ref<User[]>([])
    const messages = ref<Message[]>([])
    const newMessage = ref('')
    const chatScroll = ref<QScrollArea>()

    const load = async () => {
      const res = await api.get('https://randomuser.me/api/?results=5')
      users.value = (res.data as UserResponse).results.map(
        (user, i) =>
          ({
            id: uid(),
            name: `${user.name.first} ${user.name.last}`,
            avatar: user.picture.medium,
            color: !i ? 'primary' : `${colors[random(colors.length)]}-6`,
            me: !i
          } as User)
      )

      loading.value = false
    }

    const random = (max: number, min = 0) => {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min) + min)
    }

    const addMessage = (user: User, text: string) => {
      const lastMessage = messages.value[messages.value.length - 1]

      if (lastMessage && lastMessage.user.id === user.id) {
        lastMessage.text.push(text)
      } else {
        messages.value.push({
          id: uid(),
          user: user,
          date: new Date(),
          text: [text]
        })
      }

      scroll()
    }

    const sendMessage = () => {
      if (newMessage.value !== '') {
        addMessage(users.value[0], newMessage.value)
        newMessage.value = ''
      }
    }

    const receiveMessage = async () => {
      const randomUser = users.value.filter((user) => !user.typing && !user.me)[
        random(users.value.length)
      ]
      if (randomUser) {
        randomUser.typing = true
        const res = await api.get('https://api.quotable.io/random')
        const quote = res.data as Quote
        setTimeout(() => {
          addMessage(randomUser, `"${quote.content}" - ${quote.author}.`)
          randomUser.typing = false
        }, quote.content.length * random(60, 180))
      }
    }

    const scroll = () => {
      chatScroll.value?.setScrollPercentage('vertical', 2, 100)
    }

    onMounted(async () => {
      await load()
      setInterval(() => void receiveMessage(), random(12000, 2000))
    })

    return {
      loading,
      users,
      messages,
      newMessage,
      sendMessage,
      chatScroll,
      timeAgo
    }
  }
})
</script>

<style lang="sass">
.q-scrollarea__content
  width: 100%
  max-width: 500px
  margin: auto
  position: relative
  min-width: initial
</style>

<template>
    <Drawer
        v-if="drawerOpen"
        @close-drawer="closeDrawer"
        @delete-cart-item="console.log('delete cart item app')"
    />
    <Header @open-drawer="openDrawer" :cartSumm="cartSumm" />
    <div
        class="bg-white w-3/5 m-auto rounded-xl shadow-xl shadow-grey-200 mt-20"
    >
        <RouterView />
    </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";
import Drawer from "@/components/Drawer.vue";
import Header from "@/components/Header.vue";

const drawerOpen = ref(false);
const cartSumm = ref(0);

function openDrawer() {
    drawerOpen.value = true;
}
function closeDrawer() {
    drawerOpen.value = false;
}
function deleteCartItem() {}
</script>

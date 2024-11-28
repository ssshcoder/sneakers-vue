<template>
    <div class="flex flex-col gap-5" v-auto-animate>
        <CartItem
            v-for="item in items"
            :key="item.id"
            :id="item.id"
            :parent-id="item.parentId"
            :title="item.title"
            :price="item.price"
            :img="item.img"
            :count="item.count"
            @delete-cart-item="$emit('deleteCartItem', item.id, item.parentId)"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "@/stores/cart";
import CartItem from "./CartItem.vue";

const props = defineProps(["items"]);
const emit = defineEmits(["deleteCartItem"]);
</script>

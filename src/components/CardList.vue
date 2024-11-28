<template>
    <div class="grid grid-cols-3 gap-10" v-auto-animate>
        <Card
            v-for="item in items"
            :key="item.id"
            :title="item.title"
            :price="item.price"
            :img="item.img"
            :is-favorite="item.isFavorite"
            @click-on-favorite="emit('toggleFavoriteItem', item)"
            @click-add-to-cart="$emit('clickAddToCart', item)"
            :item="item"
        />
    </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import Card from "@/components/Card.vue";

const props = defineProps({
    items: Array,
});
const emit = defineEmits(["toggleFavoriteItem", "clickAddToCart"]);

async function fetchFavorites() {
    try {
        const { data } = await axios.get(
            "https://13c40ac57bcc6a80.mokky.dev/favorites",
            {
                params: params,
            }
        );
        items.value = data;
    } catch (error) {
        console.error("Error fetching favorites:", error.message);
    }
}
async function addToFavorite(item) {
    try {
        const params = {
            sortBy: filters.sortBy,
        };
        if (filters.searchQuery) {
            params.title = `*${filters.searchQuery}*`;
        }

        isLoading.value = true;
        const { data } = await axios.post(
            "https://13c40ac57bcc6a80.mokky.dev/favorite",
            {
                params: params,
            }
        );
        items.value = data;
    } catch (error) {
        console.error("Error fetching:", error.message);
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div class="p-10">
        <div class="flex justify-between items-center mb-10">
            <h1 class="text-3xl font-bold">Все кроссовки</h1>
            <div class="flex items-center gap-4">
                <select
                    class="py-2 px-3 border border-gray-200 focus:border-gray-400 rounded-md focus:outline-none"
                    v-model="filters.sortBy"
                >
                    <option value="title" checked>По названию</option>
                    <option value="price">По цене (дешевые)</option>
                    <option value="-price">По цене (дорогие)</option>
                </select>
                <div class="relative">
                    <input
                        type="text"
                        class="border border-gray-200 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:border-gray-400"
                        placeholder="Поиск..."
                        v-model="filters.searchQuery"
                    />
                    <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                        <img src="/search.svg" />
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isLoading">Loading...</div>
        <div v-if="!isLoading && !items.length">Товары не найдены</div>
        <CardList
            :items="items"
            @toggle-favorite-item="toggleFavoriteItem"
            @click-add-to-cart="toggleCartItem"
            v-else
        />
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import CardList from "@/components/CardList.vue";
import { useCartStore } from "@/stores/cart";
import axios from "axios";

const cart = useCartStore();

const items = ref([]);

const isLoading = ref(false);
const filters = reactive({
    searchQuery: "",
    sortBy: "title",
});

const fetchItems = async () => {
    try {
        const params = {
            sortBy: filters.sortBy,
        };
        if (filters.searchQuery) {
            params.title = `*${filters.searchQuery}*`;
        }

        isLoading.value = true;
        const { data } = await axios.get(
            "https://13c40ac57bcc6a80.mokky.dev/items",
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
};

async function toggleFavoriteItem(item) {
    console.log(item.title);
    if (items.value.includes(item)) {
        let el = items.value.find((i) => i.id === item.id);

        if (el.isFavorite === false) {
            el.isFavorite = true;
            let favoriteId = null;
            // добавление item-а в список закладок
            try {
                const elCopy = Object.assign({}, el);
                delete elCopy.id;
                const { data } = await axios.post(
                    "https://13c40ac57bcc6a80.mokky.dev/favorites/",
                    {
                        ...elCopy,
                        parentId: el.id,
                    }
                );
                console.log("Обьект из списка закладок:");
                console.log(data);
                favoriteId = data.id;
            } catch (error) {
                console.error("Error patching:", error.message);
            }
            if (favoriteId) {
                // отправка на сервер флага isFavorite
                try {
                    const { data } = await axios.patch(
                        "https://13c40ac57bcc6a80.mokky.dev/items/" + el.id,
                        {
                            isFavorite: el.isFavorite,
                            favoriteId: favoriteId,
                        }
                    );
                    console.log("Обновленный обьект:");
                    console.log(data);
                } catch (error) {
                    console.error("Error patching:", error.message);
                }
            }
        } else {
            el.isFavorite = false;
            try {
                const { data } = await axios.patch(
                    "https://13c40ac57bcc6a80.mokky.dev/items/" + el.id,
                    {
                        isFavorite: false,
                    }
                );
                console.log("Обновленный обьект(удаление):");
                console.log(data);
            } catch (error) {
                console.error("Error patching:", error.message);
            }
            if (item.favoriteId) {
                try {
                    const { data } = await axios.delete(
                        "https://13c40ac57bcc6a80.mokky.dev/favorites/" +
                            item.favoriteId
                    );
                    console.log("обьект удален");
                } catch (error) {
                    console.error("Error deleting:", error.message);
                }
            }
        }
    }
}

async function toggleCartItem(item) {
    let el = items.value.find((i) => i.id === item.id);

    if (el.inCart === true) {
        el.inCart = false;
        cart.deleteFromCart(el.id);
    } else {
        el.inCart = true;
        cart.addToCart(el);
    }
    console.log(el.inCart);
}

watch(filters, fetchItems);

watch(
    () => cart.items,
    function (newVal, oldVal) {
        console.log(newVal, oldVal);
    }
);

onMounted(() => {
    fetchItems();
});
</script>

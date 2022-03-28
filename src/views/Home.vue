<template>
  <div style="max-width: 600px" class="mx-auto">
    <div v-if="balances.length > 0" class="my-2 mx-auto d-flex mt-4">
      <div class="ms-4">
        <div v-for="balance in balances" :key="balance.id">
          <div class="caption">
            {{ balance.account_alias }}: {{ balance.balance }}
          </div>
        </div>
      </div>
      <v-spacer></v-spacer>
      <div v-if="categories.length" class="caption me-4">
        Left over balance:
        <span class="font-weight-bold">{{ leftOverBalance.toFixed(2) }}</span>
      </div>
    </div>
    <div v-else class="pa-4">
      <v-progress-linear indeterminate color="primary" />
    </div>

    <CategoriesTable :categories="categories" @getCategories="getCategories" />
    <TransactionsTable
      :transactions="transactions"
      :transactionsLoaded="transactionsLoaded"
    />
  </div>
</template>

<script>
import CategoriesTable from "@/components/CategoriesTable.vue";
import TransactionsTable from "@/components/TransactionsTable.vue";
export default {
  components: {
    CategoriesTable,
    TransactionsTable,
  },
  data() {
    return {
      transactionsLoaded: false,
    };
  },

  computed: {
    categories() {
      return this.$store.state.categories;
    },
    transactions() {
      return this.$store.state.transactions;
    },
    balances() {
      return this.$store.state.balances;
    },
    leftOverBalance() {
      return this.balances[0]?.balance - this.totalsBudget;
    },
    totalsBudget() {
      let total = 0;
      for (let i = 0; i < this.categories.length; i++) {
        const element = this.categories[i];
        total += element.budget ? parseFloat(element.budget) : 0;
      }
      return total;
    },
  },
  async created() {
    if (!localStorage.getItem("triangon_budgeting_token"))
      this.$router.push("/login");

    await this.$store.dispatch("getBalances");
    this.getCategories();
    this.getTransactions();
  },
  methods: {
    getCategories() {
      this.$store.commit("setCategories", []);
      this.$store.dispatch("getCategories");
    },
    async getTransactions() {
      await this.$store.dispatch("getTransactions");
      this.transactionsLoaded = true;
    },
  },
};
</script>

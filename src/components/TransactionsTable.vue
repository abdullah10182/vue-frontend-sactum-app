<template>
  <div class="px-2">
    <v-card class="mt-4">
      <div class="ps-4 pt-4 title grey--text">Transactions</div>
      <v-simple-table v-if="transactions.length || transactionsLoaded">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Date</th>
              <th class="text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in transactions"
              :key="item.id"
              @click="transactionDialog(item)"
            >
              <td>
                {{ item.created_at | moment }}
              </td>
              <td>{{ item.amount }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <v-skeleton-loader
        v-else
        class="mx-auto"
        max-width="300"
        type="table-tbody"
      ></v-skeleton-loader>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px" v-if="dialog">
      <v-card>
        <v-card-title>
          <span class="text-h5">Transaction</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Amount"
                  required
                  disabled
                  v-model="transactionAmount"
                ></v-text-field>

                <v-select
                  v-model="selectedCategory"
                  :items="categories"
                  label="Select"
                  data-vv-name="select"
                  required
                ></v-select>

                <v-text-field
                  label="Description"
                  v-model="description"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="processTransaction()"
            :loading="loading"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: ["transactions", "transactionsLoaded"],
  data: () => ({
    dialog: false,
    selectedTransaction: null,
    selectedCategory: null,
    loading: false,
    transactionAmount: null,
    description: null,
  }),
  filters: {
    moment: function (date) {
      return moment(date).format("MMM D YYYY, h:mm:ss a");
    },
  },
  computed: {
    selectedCategoryItem() {
      return this.$store.state.categories.filter(
        (item) => item.id == this.selectedCategory
      )[0];
    },
    categories() {
      return this.$store.state.categories.map((item) => {
        return { text: item.name, value: item.id };
      });
    },
    newBudgetAfterTransaction() {
      if (this.selectedCategoryItem?.budget) {
        return (
          parseFloat(this.selectedCategoryItem.budget) -
          parseFloat(this.transactionAmount)
        );
      } else return null;
    },
  },
  methods: {
    transactionDialog(item) {
      this.dialog = true;
      this.selectedTransaction = item;
      this.transactionAmount = item.amount;
    },
    async processTransaction() {
      this.loading = true;
      try {
        await this.$store.dispatch("processTransaction", {
          id: this.selectedTransaction.id,
          data: {
            category_id: this.selectedCategory,
            description: this.description,
            processed: 1,
          },
        });

        if (this.newBudgetAfterTransaction) {
          await this.$store.dispatch("saveNewBudget", {
            id: this.selectedCategory,
            data: {
              budget: this.newBudgetAfterTransaction,
            },
          });
          await this.$store.dispatch("getCategories");
        }
        await this.$store.dispatch("getTransactions");
        this.$parent.transactionsLoaded = true;
      } finally {
        this.selectedTransaction = null;
        this.description = null;
        this.selectedCategory = null;
        this.transactionAmount = null;
        this.dialog = false;
        this.loading = false;
      }
    },
  },
};
</script>
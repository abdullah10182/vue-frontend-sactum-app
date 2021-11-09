<template>
  <div class="px-2">
    <div class="ps-1 pt-4 title grey--text">Budgets</div>
    <v-row>
      <v-col cols="6" v-for="item in categories" :key="item.id">
        <v-card @click="categoryDialog(item)">
          <v-card-subtitle
            ><div class="caption">{{ item.name }}:</div>
            <span class="font-weight-bold">{{
              item.budget
            }}</span></v-card-subtitle
          >
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" persistent max-width="600px" v-if="dialog">
      <v-card>
        <v-card-title>
          <span class="text-h5">budget</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Budget"
                  required
                  v-model="newBudget"
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
            @click="saveNewBudget()"
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
export default {
  props: ["categories"],
  data: () => ({
    dialog: false,
    selectedCategory: null,
    newBudget: null,
    loading: false,
  }),
  computed: {},
  methods: {
    categoryDialog(item) {
      this.dialog = true;
      this.selectedCategory = item;
      this.newBudget = item.budget;
    },
    saveNewBudget() {
      let newBudget = this.processInput();
      this.loading = true;
      this.$store
        .dispatch("saveNewBudget", {
          id: this.selectedCategory.id,
          data: { budget: newBudget },
        })
        .then(() => {
          this.dialog = false;
          this.loading = false;
          this.$emit("getCategories");
        });
    },
    processInput() {
      let newBudgetString = this.newBudget.toString();
      if (newBudgetString.includes("+")) {
        let arr = newBudgetString.split("+");
        const result = parseFloat(arr[0]) + parseFloat(arr[1]);
        return result.toFixed(2);
      } else if (newBudgetString.includes("-")) {
        let arr = newBudgetString.split("-");
        const result = parseFloat(arr[0]) - parseFloat(arr[1]);
        return result.toFixed(2);
      } else return parseFloat(this.newBudget).toFixed(2);
    },
  },
};
</script>

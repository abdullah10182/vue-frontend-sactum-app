import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    balance: null,
    balanceTriangon: null,
    categories: [],
    transactions: [],
  },
  mutations: {
    setBalance(state, balance) {
      state.balance = balance;
    },
    setBalanceTriangon(state, balance) {
      state.balanceTriangon = balance;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setTransactions(state, transactions) {
      state.transactions = transactions;
    },
  },
  actions: {
    async getBalance({ commit }) {
      return await axios
        .get(process.env.VUE_APP_URL_BALANCE)
        .then((res) => {
          if (res.status == 200) {
            let balancePersonal = parseFloat(
              Buffer.from(res.data.balance, "base64")
            );
            let balanceTriagon = parseFloat(
              Buffer.from(res.data.balanceTriangon, "base64")
            );
            commit("setBalance", balancePersonal);
            commit("setBalanceTriangon", balanceTriagon);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getCsrfToken({ _ }, payload) {
      return axios
        .get(`${process.env.VUE_APP_BASE_URL_API}/sanctum/csrf-cookie`)
        .then((res) => {
          console.log(res);
          if (res.status == 200 || res.status == 204) {
            return axios
              .post(`${process.env.VUE_APP_BASE_URL_API}/api/login`, {
                email: payload.email,
                password: payload.password,
              })
              .then((res) => {
                console.log(_);
                localStorage.setItem(
                  "triangon_budgeting_token",
                  res.data.token
                );
                return res;
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getCategories({ commit }) {
      return axios
        .get(`${process.env.VUE_APP_BASE_URL_API}/api/categories`, {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("triangon_budgeting_token"),
          },
        })
        .then((res) => {
          if (res.status == 200) {
            commit("setCategories", res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getTransactions({ commit }) {
      return axios
        .get(
          `${process.env.VUE_APP_BASE_URL_API}/api/transactions?processed=0`,
          {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem("triangon_budgeting_token"),
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            commit("setTransactions", res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async saveNewBudget({ _ }, payload) {
      return axios
        .put(
          `${process.env.VUE_APP_BASE_URL_API}/api/categories/${payload.id}`,
          payload.data,
          {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem("triangon_budgeting_token"),
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            console.log(_);
            return res.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async processTransaction({ _ }, payload) {
      return axios
        .put(
          `${process.env.VUE_APP_BASE_URL_API}/api/transactions/${payload.id}`,
          payload.data,
          {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem("triangon_budgeting_token"),
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            console.log(_);
            return res.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async logout() {
      localStorage.removeItem("triangon_budgeting_token");
      return axios
        .post(`${process.env.VUE_APP_BASE_URL_API}/api/logout`, null, {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("triangon_budgeting_token"),
          },
        })
        .then(() => {
          location.reload();
        })
        .catch(() => {
          location.reload();
        });
    },
  },
  modules: {},
});

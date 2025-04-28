import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import EventsView from "../views/EventsView.vue";
import EventDetailView from "../views/EventDetailView.vue";
import AddEventView from "../views/AddEventView.vue";
import EditEventView from "../views/EditEventView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/events",
    name: "events",
    component: EventsView,
  },
  {
    path: "/events/:id",
    name: "event-detail",
    component: EventDetailView,
    props: true,
  },
  {
    path: "/events/add",
    name: "add-event",
    component: AddEventView,
  },
  {
    path: "/events/:id/edit",
    name: "edit-event",
    component: EditEventView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

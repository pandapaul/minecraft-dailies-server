import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("quests", "routes/quests.tsx"),
  route("quests/list", "routes/quests.list.tsx"),
  route("activities", "routes/activities.tsx"),
  route("stats", "routes/stats.tsx"),
  route(":username/quests", "routes/$username.quests.tsx"),
] satisfies RouteConfig;

const config = {
  backendUrl:  import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
  googleClientId: "353025036934-bn00sqsf5o1ess16bfhf02ao34i8rhvd.apps.googleusercontent.com",
};

export default config;

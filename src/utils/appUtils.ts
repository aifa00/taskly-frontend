import { jwtDecode } from "jwt-decode";

// Decode the token to get the user ID
export const getUserId = (): string | undefined => {
  const token = localStorage.getItem("token");
  let userId: string | undefined;

  if (token) {
    try {
      const decodedToken = jwtDecode(token) as any;
      userId = decodedToken.userId;
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  return userId;
};

export const getStatusColor = (status: string) => {
  if (status === "pending") return "text-amber-400"; // Warm Amber
  if (status === "in-progress") return "text-indigo-500"; // Muted Indigo
  if (status === "completed") return "text-emerald-600"; // Rich Emerald
  if (status === "blocked") return "text-rose-600"; // Deep Rose
};

export const getPriorityColor = (priority: string) => {
  if (priority === "low") return "text-teal-400"; // Calming Teal
  if (priority === "medium") return "text-purple-600"; // Soft Purple
  if (priority === "high") return "text-red-700"; // Vivid Red
};

export const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const modifyDate = (date: string) => {
  if (!date) return "Not Available";
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// // Decode the token to get the user ID
// export const getUserId = () => {
//   const token = localStorage.getItem("token");
//   let userId;
//   if (token) {
//     try {
//       const decodedToken = jwtDecode<>(token);
//       userId = decodedToken.userId;
//     } catch (error) {
//       console.error("Failed to decode token:", error);
//     }
//   }

//   return userId;
// };

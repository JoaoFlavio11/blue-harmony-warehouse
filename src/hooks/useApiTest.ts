// src/hooks/useApiTest.ts
import { useEffect } from "react";
import api from "@/services/api";

export const useApiTest = () => {
  useEffect(() => {
    api.get("/ping")
      .then((res) => console.log("API OK:", res.data))
      .catch((err) => console.error("Erro ao conectar à API:", err));
  }, []);
};

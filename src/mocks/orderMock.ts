// src/mocks/ordersMock.ts
import { Order } from "@/types";

export const ordersMock: Order[] = [
  {
    id: "a2a3bb46-68a2-402a-a8b0-7520e5f938ca",
    externalId: "ORD-2025-001",
    status: "picking",
    createdAt: "2025-11-10T14:22:31-03:00",
    completedAt: null,
    items: [
      {
        id: "d65e48f2-9487-49d3-a1ac-6fd9cdc0e046",
        sku: "PRD-001-TV42",
        qty: 1,
        pickedQty: 0,
        binCode: "A1-B-03",
      },
      {
        id: "c9da1a77-1368-4215-b812-2b2234d854fc",
        sku: "PRD-554-HDMI",
        qty: 2,
        pickedQty: 1,
        binCode: "A1-A-01",
      },
    ],
  },

  {
    id: "0b2c50ea-1ff1-4c8d-a440-4377bd42e0b9",
    externalId: "ORD-2025-002",
    status: "pending",
    createdAt: "2025-11-12T09:10:52-03:00",
    completedAt: null,
    items: [
      {
        id: "f3f6f454-174f-41af-b67f-91c1dc06abea",
        sku: "PRD-890-NB15",
        qty: 1,
        pickedQty: 0,
        binCode: "B2-C-10",
      },
    ],
  },

  {
    id: "c84e51b6-358e-4ed0-8783-9cc02ccaa820",
    externalId: "ORD-2025-003",
    status: "pending",
    createdAt: "2025-11-14T16:44:11-03:00",
    completedAt: null,
    items: [],
  },

  {
    id: "08d44ad5-bdd7-4c6d-89be-9dfd7b4575c3",
    externalId: "ORD-2025-004",
    status: "picking",
    createdAt: "2025-11-15T08:12:09-03:00",
    completedAt: null,
    items: [
      {
        id: "b31ba8f0-1997-4b83-a5c6-c28ddadf2af6",
        sku: "PRD-332-HEADSET",
        qty: 3,
        pickedQty: 2,
        binCode: "C3-D-02",
      },
      {
        id: "e10ea21c-7bf1-477e-bf2f-b9665a0bb750",
        sku: "PRD-910-MOUSEPRO",
        qty: 1,
        pickedQty: 0,
        binCode: "C3-A-08",
      },
    ],
  },

  {
    id: "c77e6789-eef5-4cc9-b01e-55f7a12bc987",
    externalId: "ORD-2025-005",
    status: "completed",
    createdAt: "2025-11-15T11:30:45-03:00",
    completedAt: "2025-11-15T12:04:10-03:00",
    items: [
      {
        id: "f090b4e0-c7c3-4ac4-9e5b-2c8df9d78d11",
        sku: "PRD-441-SMARTWATCH",
        qty: 2,
        pickedQty: 2,
        binCode: "D1-A-02",
      },
    ],
  },

  {
    id: "5aaf1398-92a7-44f4-af62-9cddebb85619",
    externalId: "ORD-2025-006",
    status: "pending",
    createdAt: "2025-11-16T10:41:23-03:00",
    completedAt: null,
    items: [],
  },

  {
    id: "329fd712-ca3d-4c6d-90c4-a4cf96f48518",
    externalId: "ORD-2025-007",
    status: "picking",
    createdAt: "2025-11-16T14:55:09-03:00",
    completedAt: null,
    items: [
      {
        id: "88dc11ef-8e92-4ad5-885d-aaf4d0213e22",
        sku: "PRD-771-CAMERA4K",
        qty: 1,
        pickedQty: 0,
        binCode: "E2-A-05",
      },
      {
        id: "66cf3c88-aaab-43ab-ac86-d40b92b7ce0a",
        sku: "PRD-222-SD128",
        qty: 4,
        pickedQty: 4,
        binCode: "E2-C-09",
      },
    ],
  },

  {
    id: "cc5c42e0-d940-4a3b-8dd7-d4bcd6aab467",
    externalId: "ORD-2025-008",
    status: "completed",
    createdAt: "2025-11-16T09:25:00-03:00",
    completedAt: "2025-11-16T10:10:14-03:00",
    items: [
      {
        id: "908f01b6-aa55-4d6b-9eb3-8c742811fb40",
        sku: "PRD-121-SPEAKERBT",
        qty: 1,
        pickedQty: 1,
        binCode: "F1-B-03",
      },
      {
        id: "224e02ce-dec2-49b0-8b19-3b11362db6c7",
        sku: "PRD-909-USB32",
        qty: 3,
        pickedQty: 3,
        binCode: "F1-A-01",
      },
    ],
  },
];

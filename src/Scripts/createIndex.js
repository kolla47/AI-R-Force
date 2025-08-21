export default async function createIndexRest() {
  const url = `https://ai-r-search.search.windows.net/indexes/kb-index?api-version=2024-07-01`;
  const payload = {
    name: "AI_R_Force-KB",
    fields: [
      { name: "id", type: "Edm.String", key: true },
      { name: "title", type: "Edm.String", searchable: true },
      { name: "tags", type: "Collection(Edm.String)", searchable: true },
      {
        name: "status",
        type: "Edm.String",
        searchable: true,
        filterable: true,
      },
      { name: "KB", type: "Edm.String", searchable: true },
      {
        name: "vector",
        type: "Collection(Edm.Single)",
        searchable: true,
        dimensions: 1536,
        vectorSearchProfile: "default-vector-profile",
      },
    ],
    vectorSearch: {
      algorithms: [
        {
          name: "default-hnsw-config",
          kind: "hnsw",
          hnswParameters: {
            m: 4,
            efConstruction: 400,
            efSearch: 500,
            metric: "cosine",
          },
        },
      ],
      profiles: [
        {
          name: "default-vector-profile",
          algorithm: "default-hnsw-config",
        },
      ],
    },
  };

  const response = await fetch(url.trim(), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "api-key": "",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("Error:", data);
  } else {
    console.log("Index created via REST ✅");
  }
}

createIndexRest();

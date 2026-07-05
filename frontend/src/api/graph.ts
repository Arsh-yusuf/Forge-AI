import api from "./api";

export async function getGraph() {

    const response = await api.get("/graph");

    return response.data;

}

export async function getNodeDetails(
    concept: string
) {

    const response = await api.get(
        `/graph/node/${concept}`
    );

    return response.data;

}
'use server';

import { contentQuery } from './queries/contentQuery';
import getData from './getData';

const moleculeQuery = (type: string, id: string, fields: string, experienceKey = '') => {
  return contentQuery(
    `
    query {
      component: ${type}(id: \\"${id}\\") {
        ${fields}
        contentItemsCollection(limit: 10) {
          items {
            ... on Entry {
              __typename
              sys {
                id
              }
            }
          }
        }
      }
    }
  `,
    experienceKey
  );
};

const atomicQuery = (type: string, id: string, fields: string, experienceKey = '') => {
  return contentQuery(
    `
    query {
      component: ${type}(id: \\"${id}\\") {
        ${fields}
      }
    }
  `,
    experienceKey
  );
};

export async function getComponent(
  type: string,
  id: string,
  fields: string,
  atom: boolean = false,
  token: string | null = null,
  experienceKey = ''
) {
  const query = atom ? atomicQuery(type, id, fields, experienceKey) : moleculeQuery(type, id, fields, experienceKey);
  const result = await getData(query, token);
  if (!result) {
    console.error(`Error: getComponent.js - No component found. Component: ${type} ID: ${id}`);
    throw new Error('No result');
  }
  return JSON.parse(result.contentDataRequest[0])?.data.component;
}

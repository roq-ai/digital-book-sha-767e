import axios from 'axios';
import queryString from 'query-string';
import { HighlightInterface, HighlightGetQueryInterface } from 'interfaces/highlight';
import { GetQueryInterface } from '../../interfaces';

export const getHighlights = async (query?: HighlightGetQueryInterface) => {
  const response = await axios.get(`/api/highlights${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createHighlight = async (highlight: HighlightInterface) => {
  const response = await axios.post('/api/highlights', highlight);
  return response.data;
};

export const updateHighlightById = async (id: string, highlight: HighlightInterface) => {
  const response = await axios.put(`/api/highlights/${id}`, highlight);
  return response.data;
};

export const getHighlightById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/highlights/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteHighlightById = async (id: string) => {
  const response = await axios.delete(`/api/highlights/${id}`);
  return response.data;
};

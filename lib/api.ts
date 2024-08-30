import PocketBase from 'pocketbase';

const pb = new PocketBase('http://hub.ruadebaixo.com.br:1002');

export function buildImageUrl(record, firstFilename: string) {
  return pb.files.getUrl(record, firstFilename)
}

export async function getProjects() {
  try {
    const records = await pb.collection('projects').getFullList({
      expand: 'icons',
    });
    return records;
  }
  catch (error) {
    throw(error);
  }
}

export async function getTechnologies() {
  try {
    const records = await pb.collection('icons').getFullList({
      filter: 'technology = true',
    });
    console.log('Resultado:', records)
    return records;
  }
  catch (error) {
    console.log('Erro: ', error)
    throw (error);
  }
}
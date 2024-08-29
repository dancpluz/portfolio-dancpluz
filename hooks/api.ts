import PocketBase from 'pocketbase';

const pb = new PocketBase('http://hub.ruadebaixo.com.br:1002');

export function buildUrl(record, firstFilename) {
  return pb.files.getUrl(record, firstFilename)
}

export async function getProjects() {
  try {
    const records = await pb.collection('projects').getFullList({
      sort: '-created',
      expand: 'icons',
    });
    console.log('Resultado:',records)
    return records;
  }
  catch (error) {
    console.log('Erro: ', error)
    throw(error);
  }
}
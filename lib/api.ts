import PocketBase from 'pocketbase';

const pb = new PocketBase('http://hub.ruadebaixo.com.br:1002');

export function buildImageUrl(record, firstFilename: string) {
  return pb.files.getUrl(record, firstFilename)
}

export async function getProjects() {
  try {
    const records = await pb.collection('projects').getFullList({
      expand: 'icon_refs',
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

export async function getExperience() {
  try {
    const records = await pb.collection('experience').getFullList({
      sort: '+start_date',
      expand: 'icon_ref'
    });
    console.log('Resultado:', records)
    return records;
  }
  catch (error) {
    console.log('Erro: ', error)
    throw (error);
  }
}
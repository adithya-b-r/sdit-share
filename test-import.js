try {
  require('appwrite');
  console.log('Appwrite found');
} catch (e) {
  console.log('Appwrite NOT found');
  console.error(e.message);
}

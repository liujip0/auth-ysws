const authors = {
  akaal: {
    name: "Akaal",
    pfp: "pfps/akaal.png",
    role: "Volunteer",
    meta: "https://github.com/Spacexplorer11"
  },
  jim: {
    name: "Jim",
    pfp: "pfps/jim.png",
    role: "Admin",
    meta: "https://github.com/jimmydin7"
  }
};
const announcementsData = [
  {
    title: "We just got access to HCB!",
    content: "The YSWS-AUTHLY Hack Club Bank (HCB) organization just got approved, Leo is currently helping me set up restrictions! We are getting way close to launch than you think!",
    date: "Aug 4, 2025",
    importance: "Medium",
    authorId: "jim"
  },
  {
    title: "New rewards for authly",
    content: "After some consideration, me and my POC decided yubikeys, programmable NFC tags, and antivirus software giftcards as the rewards we will offer. You will be getting yubikeys for 10 hours of work, NFC tags for 4 hours of work, and antivirus for around 6 hours of work.",
    date: "Aug 4, 2025",
    importance: "High",
    authorId: "jim"
  },
  {
    title: "How I help in Authly",
    content: "Hey, my name is Akaal and I have been helping Jim with Authly for a while now.",
    date: "Aug 3, 2025",
    importance: "Low",
    authorId: "akaal"
  }
];
const container = document.getElementById("announcements");
announcementsData.forEach(item => {
  const author = authors[item.authorId];
  const html = `
    <div class="bg-gray-800 p-5 rounded-xl shadow-md">
      <div class="flex items-center space-x-4 mb-3">
        <img src="${author.pfp}" alt="${author.name} avatar" class="w-10 h-10 rounded-full" />
        <div>
          <a href="${author.meta}"><p class="text-sm font-semibold">${author.name}</p></a>
          <p class="text-xs text-gray-400">${item.date} • ${author.role}</p>
        </div>
      </div>
      <h3 class="text-lg font-semibold mb-1">${item.title}</h3>
      <p class="text-sm text-gray-300">${item.content}</p>
      <p class="text-xs mt-2 text-gray-500 italic">Importance: ${item.importance}</p>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);
});

import prisma from "$lib/prisma";

export const load = (async ({ params: { country } }) => { 
  const countryData = await prisma.sdgdata.findUnique({
    where: { "Country": country },
  })
  return {
      country: country, 
      countryData
  }
})
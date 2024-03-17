<script>
  export let data;
  import { Flex } from '@svelteuidev/core';
</script>

<h2>{ data.country }</h2>
<Flex justify="center" gap="lg">
  {#each Object.entries(data.countryData) as [key, value], index (key)}
    <div>
      <header>{key}</header>
      <p>{value}</p>
    </div>
  {/each}
</Flex>
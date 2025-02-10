const renderEmbeddedEntry = (node: any, entryMap: Map<any, any>, componentMap: Record<string, any>) => {
  // find the entry in the entryMap by ID
  const entry = entryMap.get(node?.data?.target?.sys?.id ?? '');

  if (entry) {
    const Component = componentMap[entry.__typename];

    if (Component) {
      return <Component data={entry} />;
    }
  }

  return '';
};

export default renderEmbeddedEntry;

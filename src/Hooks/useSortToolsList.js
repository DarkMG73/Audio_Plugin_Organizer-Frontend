const useSortToolsList = () => {
  const outputFunction = (
    // Master tools Array of Objects
    userToolsLibrary,
    //Companies
    sortArray,
    // Tools for this user list od master ID's
    currentMasterLibraryIDArray,
    cleanStr,
    limitedToolsListArr,
    setUnMatchedItems,
  ) => {
    if (!currentMasterLibraryIDArray) currentMasterLibraryIDArray = [];

    const output = [];

    // For each company make a company group Object
    sortArray.forEach((topic) => {
      output.push({
        [topic]: userToolsLibrary.filter((item) => {
          if (item.company === '-') {
          }

          // Make sure all previous masterLibraryID's treated with current standard
          const groomedCurrentMasterLibraryIDArray =
            currentMasterLibraryIDArray.map((masterLibraryID) =>
              cleanStr(masterLibraryID),
            );

          return (
            item.company === topic &&
            !groomedCurrentMasterLibraryIDArray.includes(
              cleanStr(item.masterLibraryID),
            )
          );
        }),
      });
    });

    // Remove all empty topic categories
    const filteredOutput = output.filter((group) => {
      const value = Object.values(group)[0];

      return value.constructor === Array && value.length > 0;
    });

    // Replace personal settings with defaults
    let cleanedOutput = filteredOutput.map((group) => {
      const [companyData] = Object.entries(group);
      const company = companyData[0];
      const valueArray = companyData[1];
      const outputCompanyArray = [];
      valueArray.forEach((tool) => {
        const outputToolData = { ...tool };

        // Add defaults
        outputToolData.status = 'active';
        outputToolData.rating = '3';
        outputToolData.notes = '';
        outputToolData.favorite = 'false';

        outputCompanyArray.push(outputToolData);
      });

      const outputCompanyObj = { [company]: [...outputCompanyArray] };

      return outputCompanyObj;
    });

    // Bring in list of file names
    let limitedCleanedOutputArr = [];

    if (limitedToolsListArr) {
      const limitedToolsListMasterIDArray = limitedToolsListArr.map((name) =>
        cleanStr(name),
      );

      cleanedOutput.forEach((group) => {
        const [companyData] = Object.entries(group);
        const company = companyData[0];
        const valueArray = companyData[1];
        const outputCompanyArray = [];
        valueArray.forEach((tool) => {
          if (
            limitedToolsListMasterIDArray.includes(
              cleanStr(tool.masterLibraryID),
            )
          ) {
            outputCompanyArray.push(tool);
          }
        });

        const outputCompanyObj = { [company]: [...outputCompanyArray] };

        limitedCleanedOutputArr.push(outputCompanyObj);
      });

      // Remove all empty topic categories
      limitedCleanedOutputArr = limitedCleanedOutputArr.filter((group) => {
        const value = Object.values(group)[0];
        return value.constructor === Array && value.length > 0;
      });
    }

    // Filter sorted, cleaned Library list to only include those that match masterLibraryID to file named (cleaned)

    // Display matches.

    // Send unmatched back to parent.
    // Build name List of output
    const limitedOutputToolList = [];
    for (const group of Object.values(limitedCleanedOutputArr)) {
      Object.values(group).forEach((tools) =>
        limitedOutputToolList.push(...tools),
      );
    }

    const limitedOutputNameList = [];
    for (const tool of Object.values(limitedOutputToolList)) {
      limitedOutputNameList.push(cleanStr(tool.name));
    }
    if (limitedToolsListArr) {
      const unMatchedItems = limitedToolsListArr.filter((name) => {
        return !limitedOutputNameList.includes(cleanStr(name));
      });

      setUnMatchedItems(unMatchedItems);
      cleanedOutput = limitedCleanedOutputArr;
    }

    return cleanedOutput;
  };
  return outputFunction;
};

export default useSortToolsList;

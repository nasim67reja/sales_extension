export const userBasicInfo = () => {
  const linkedinName = document
    .querySelector(".text-heading-xlarge")
    ?.textContent.trim();

  let companyName = null;
  const taglineElement = document
    .querySelector(".org-top-card__primary-content")
    ?.querySelector(".org-top-card-summary__tagline");

  if (taglineElement) {
    companyName =
      taglineElement.parentElement?.firstElementChild?.textContent.trim();
  } else {
    const infoListElement = document
      .querySelector(".org-top-card__primary-content")
      ?.querySelector(".org-top-card-summary-info-list");
    if (infoListElement) {
      companyName =
        infoListElement.parentElement?.firstElementChild?.textContent.trim();
    }
  }

  const upworkName = document
    .querySelector('[itemscope="itemscope"]')
    ?.querySelector('[itemprop="name"]')
    ?.textContent.trim();

  const twitterName =
    document
      .querySelector('[data-testid="UserName"]')
      ?.children[0]?.querySelectorAll('[dir="ltr"]')[0]?.children[0].children[0]
      .textContent || "";

  const profileInfo = {
    userName: companyName || linkedinName || upworkName || twitterName || null,
    profileUrl: window.location.href.split("?")[0],
    isExist: false,
  };
  return profileInfo;
};

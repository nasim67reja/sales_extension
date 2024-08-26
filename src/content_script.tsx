// Content script is injected into the LinkedIn page and handles data extraction

// Function to extract personal information
const extractLinkedinPersonalInfo = () => {
  const profileName = document
    .querySelector(".text-heading-xlarge")
    ?.textContent.trim();

  const profileImageElement = document.querySelector(
    `img[alt^="${profileName}"]`
  ) as HTMLImageElement | null;

  // Use optional chaining to safely access the src property
  const profileImageSrc = profileImageElement?.src || "default-image-url";

  const element = document.querySelector("#about");

  const aboutel =
    element &&
    element
      .closest('[data-view-name="profile-card"]')
      .children[2].querySelector(".visually-hidden").textContent;

  const about = aboutel ? aboutel : "about";

  const titleElement =
    // document
    //   .querySelector(".pv-text-details__about-this-profile-entrypoint")
    //   ?.closest(".mt2")
    //   ?.children[0]?.querySelector(".text-body-medium.break-words");
    document
      .querySelector(".scaffold-layout__main")
      ?.children[0]?.querySelector(".ph5")
      ?.querySelector(".mt2.relative")?.children[0]?.children[1];

  const title = titleElement ? titleElement.textContent.trim() : "";

  const personalInfo = {
    profileName,
    profileImageSrc,
    about,
    title,
  };

  return personalInfo;
};

// Function to extract work experience information
const extractLinkedinWorkExperience = () => {
  const element = document.querySelector("#experience");
  const experienceElements =
    element &&
    element
      .closest('[data-view-name="profile-card"]')
      .children[2].querySelectorAll(
        '[data-view-name="profile-component-entity"]'
      );

  const workExperience = [];

  experienceElements &&
    experienceElements.forEach((experienceElement) => {
      const jobTitle = experienceElement
        .querySelector(".mr1.t-bold")
        ?.children[0].textContent.trim();

      const company = experienceElement
        .querySelector(".t-14.t-normal")
        ?.children[0].textContent.trim();
      const duration = experienceElement
        .querySelector(".t-14.t-normal.t-black--light")
        ?.children[0].textContent.trim();

      const experienceEntry = {
        jobTitle,
        company,
        duration,
      };

      workExperience.push(experienceEntry);
    });

  return workExperience;
};

// Function to extract education details
const extractLinkedinEducationDetails = () => {
  const educationElements = document
    .querySelector("#education")
    ?.closest('[data-view-name="profile-card"]')
    .children[2].querySelectorAll(
      '[data-view-name="profile-component-entity"]'
    );

  const educationDetails = [];

  educationElements &&
    educationElements.forEach((educationElement) => {
      const institute = educationElement
        .querySelector(".mr1.t-bold")
        ?.children[0].textContent.trim();

      const department = educationElement
        .querySelector(".t-14.t-normal")
        ?.children[0].textContent.trim();
      const studyPeriod = educationElement
        .querySelector(".t-14.t-normal.t-black--light")
        ?.children[0].textContent.trim();

      const educationEntry = {
        institute,
        department,
        studyPeriod,
      };

      educationDetails.push(educationEntry);
    });

  return educationDetails;
};

// Function to extract license and certification details
const extractLinkedinLicenseCertification = () => {
  const licenseCertificationElements = document
    .querySelector("#licenses_and_certifications")
    ?.closest('[data-view-name="profile-card"]')
    .children[2].querySelectorAll(
      '[data-view-name="profile-component-entity"]'
    );

  const licenseCertificationDetails = [];

  licenseCertificationElements &&
    licenseCertificationElements.forEach((element) => {
      const title = element
        .querySelector(".mr1.t-bold")
        ?.children[0].textContent.trim();

      const issuer = element
        .querySelector(".t-14.t-normal")
        ?.children[0].textContent.trim();
      const issuanceDate = element
        .querySelector(".t-14.t-normal.t-black--light")
        ?.children[0].textContent.trim();

      const licenseCertificationEntry = {
        title,
        issuer,
        issuanceDate,
      };

      licenseCertificationDetails.push(licenseCertificationEntry);
    });

  return licenseCertificationDetails;
};

// Function to extract Skills and language details
const extractLinkedinSkills = () => {
  const skillsElements = document
    .querySelector("#skills")
    ?.closest('[data-view-name="profile-card"]')
    .children[2].querySelectorAll(
      '[data-view-name="profile-component-entity"]'
    );

  const skillsDetails = [];

  skillsElements &&
    skillsElements.forEach((element) => {
      const skill = element
        .querySelector('[data-field="skill_card_skill_topic"]')
        ?.querySelector(".mr1.hoverable-link-text.t-bold")
        .children[0].textContent.trim();

      skillsDetails.push(skill);
    });

  return skillsDetails;
};

const extractUpworkSkills = () => {
  const skillsEl = document.querySelectorAll(".skill-name");
  let skills = [];
  skillsEl.forEach((el) => {
    const skill = el.textContent.trim();
    skills.push(skill);
  });
  return skills;
};

// document.addEventListener("DOMContentLoaded", extractPersonalInfo);

// Listen for page load and trigger data extraction

const extractTwitter = () => {
  const userNameElement = document
    .querySelector('[data-testid="UserName"]')
    .children[0].querySelectorAll('[dir="ltr"]');

  const profileName = userNameElement[0].children[0].children[0].textContent;

  const userName = userNameElement[1].children[0].textContent;

  const cleanedUserName = userName.replace("@", "");
  const profileImageElement = document
    .querySelector(`[data-testid="UserAvatar-Container-${cleanedUserName}"]`)
    .querySelector("img") as HTMLImageElement | null;

  // Use optional chaining to safely access the src property
  const profileImageSrc =
    (profileImageElement as HTMLImageElement)?.src || "default-image-url";

  const title = document.querySelector('[data-testid="UserDescription"]')
    ?.children[0].textContent;

  const location = document.querySelector('[data-testid="UserLocation"]')
    ?.children[1].children[0].textContent;

  const following = document.querySelector(
    `[href="/${cleanedUserName}/following"]`
  )?.children[0].children[0].textContent;

  const followers = document.querySelector(
    `[href="/${cleanedUserName}/verified_followers"]`
  )?.children[0].children[0].textContent;

  const personalInfo = {
    profileName,
    userName,
    title,
    location,
    profileImageSrc,
    following,
    followers,
  };

  return personalInfo;
};

const extractUpworkPersonalInfo = () => {
  const profile = document.querySelector('[itemscope="itemscope"]');

  const profileName = profile
    ?.querySelector('[itemprop="name"]')
    ?.textContent.trim();

  const profileImageSrc = profile?.querySelector("img")?.src;

  const locality = profile.querySelector('[itemprop="locality"]').textContent;
  const country = profile.querySelector(
    '[itemprop="country-name"]'
  ).textContent;
  const location = `${locality}, ${country}`;

  const level = document
    .querySelector(".identity-badges-container")
    ?.querySelector(".air3-badge-tagline")?.children[1].textContent;

  const status = document
    .querySelector(".identity-badges-container")
    .querySelector('[data-test="badge-hidden-label"]')?.textContent;

  const aboutHistoryEL = document.querySelector(
    '[data-ev-sublocation="!line_clamp"]'
  );
  const about = aboutHistoryEL?.children[0]?.children[0]?.textContent;
  const title =
    aboutHistoryEL
      ?.closest(".air3-card-section")
      ?.querySelector("h2")
      ?.textContent.trim() || "";

  const stat = document
    .querySelector(".cfe-ui-profile-summary-stats")
    ?.querySelectorAll(".stat-amount");
  const totalJob = stat && stat[0]?.children[0].textContent.trim();

  const totalHour = stat && stat[1]?.children[0].textContent.trim();

  const personalInfo = {
    profileName,
    title,
    level,
    location,
    profileImageSrc,
    status,
    about,
    totalJob,
    totalHour,
  };
  return personalInfo;
};

const extractLinkedinCompanyAboutInfo = () => {
  // Look for a section that might contain the overview information
  const aboutSection =
    document.querySelector(
      ".org-page-details-module__card-spacing .org-about-module__margin-bottom"
    ) ||
    document.querySelector(
      ".artdeco-card .org-page-details-module__card-spacing"
    ) ||
    document.querySelector(".org-page-details-module__card-spacing");

  const aboutParagraph =
    aboutSection?.querySelector("p.break-words") ||
    aboutSection?.querySelector("p.text-body-medium") ||
    aboutSection?.querySelector("p");

  const about = aboutParagraph ? aboutParagraph.textContent.trim() : null;

  return about;
};
// Function to extract company information
const extractLinkedinCompanyInfo = () => {
  let profileName = null;
  const taglineElement = document
    .querySelector(".org-top-card__primary-content")
    ?.querySelector(".org-top-card-summary__tagline");

  if (taglineElement) {
    profileName =
      taglineElement.parentElement?.firstElementChild?.textContent.trim();
  } else {
    const infoListElement = document
      .querySelector(".org-top-card__primary-content")
      ?.querySelector(".org-top-card-summary-info-list");
    if (infoListElement) {
      profileName =
        infoListElement.parentElement?.firstElementChild?.textContent.trim();
    }
  }

  const title = taglineElement?.textContent.trim() || "";

  // Extracting profile image source
  const profileImageElement = document.querySelector(
    ".org-top-card-primary-content__logo"
  ) as HTMLImageElement | null;
  const profileImageSrc = profileImageElement?.src || "default-image-url";

  // Extracting summary information
  const summaryElements = document.querySelectorAll(
    ".org-top-card-summary-info-list__info-item"
  );
  const summary = Array.from(summaryElements)
    .map((item) => item.textContent.trim())
    .join(", ");

  const about = extractLinkedinCompanyAboutInfo();

  const personalInfo = {
    profileName,
    title,
    summary,
    profileImageSrc,
    about,
  };

  return personalInfo;
};

const extractLinkedinContactEmail = () => {
  // Look for the contact info section in the DOM
  const contactInfoSection = document.querySelector(".artdeco-modal__content");

  if (!contactInfoSection) {
    return null;
  }

  // Look for the email section within the contact info section
  const emailSection = Array.from(
    contactInfoSection.querySelectorAll("section.pv-contact-info__contact-type")
  ).find((section) => {
    const header = section.querySelector("h3.pv-contact-info__header");
    return header && header.textContent.trim().toLowerCase() === "email";
  });

  // Extract the email address from the email section
  const emailLink = emailSection
    ? emailSection.querySelector("a[href^='mailto:']")
    : null;
  const email = emailLink ? emailLink.textContent.trim() : null;

  return email;
};

const extractLinkedinAllSkills = () => {
  const skillElements = document.querySelectorAll(
    "li.pvs-list__paged-list-item"
  );

  const skills = Array.from(skillElements).map((skillElement) => {
    const skillNameElement = skillElement.querySelector(
      ".hoverable-link-text span.visually-hidden"
    );
    return skillNameElement ? skillNameElement.textContent.trim() : null;
  });

  const uniqueSkills = [...new Set(skills.filter((skill) => skill !== null))];

  return uniqueSkills;
};

const extractLinkedinAllServices = () => {
  // Select all service list items in the LinkedIn profile
  const serviceElements = document.querySelectorAll(
    "li.service-pages-services-provided-card__service-pills"
  );

  // Extract the service names from each list item
  const services = Array.from(serviceElements).map((serviceElement) => {
    const serviceNameElement = serviceElement.querySelector(
      ".service-pages-services-provided-card__service-pills-link"
    );
    return serviceNameElement ? serviceNameElement.textContent.trim() : null;
  });

  // Filter out any null values (in case a service name was not found)
  return services.filter((service) => service !== null);
};

const extractProfileInfo = (origin: string) => {
  let personalInfo: any = {};
  let workExperience: any = "",
    educationDetails: any = "",
    licenseCertification: any = "",
    skills: any = "",
    services: any = "",
    company: boolean = false,
    scrapSkills: boolean = false;

  if (origin === "linkedin") {
    // Check if it's a company profile
    if (window.location.href.includes("/company/")) {
      personalInfo = extractLinkedinCompanyInfo();
      company = true;

      // Check if the about information is missing
      if (!personalInfo.about) {
        const proceed = confirm(
          "About information is not scraped. Would you like to navigate to the About section and scrape it?"
        );

        if (proceed) {
          let newUrl = window.location.href;

          const urlParts = newUrl.split("/");
          if (urlParts.length > 4 && urlParts[3] === "company") {
            newUrl = `${urlParts[0]}//${urlParts[2]}/company/${urlParts[4]}/about/`;
          }

          window.location.href = newUrl;
          // Don't send profile data yet
          return;
        } else {
          sendProfileToBackground(personalInfo, company);
        }
      } else {
        sendProfileToBackground(personalInfo, company);
      }
    } else if (window.location.href.includes("/details/skills")) {
      skills = extractLinkedinAllSkills();
      scrapSkills = true;
    } else if (window.location.href.includes("/details/services")) {
      services = extractLinkedinAllServices();
    } else {
      personalInfo = extractLinkedinPersonalInfo();
      workExperience = extractLinkedinWorkExperience();
      educationDetails = extractLinkedinEducationDetails();
      licenseCertification = extractLinkedinLicenseCertification();
      skills = extractLinkedinSkills();
      services = "";

      // Check if email information is missing
      const email = extractLinkedinContactEmail();
      const isOnContactInfoPage = window.location.href.includes(
        "overlay/contact-info/"
      );

      if (!email && !isOnContactInfoPage) {
        const proceed = confirm(
          "Email information is not scraped. Would you like to navigate to the Contact Info page and scrape it?"
        );

        if (proceed) {
          // Navigate to the contact info page
          window.location.href = `${
            window.location.href.split("?")[0]
          }overlay/contact-info/`;

          // Don't send profile data yet
          return;
        } else {
          personalInfo.email = email;
        }
      } else {
        personalInfo.email = email;
      }
    }
  } else if (origin === "twitter") {
    personalInfo = extractTwitter();
  } else if (origin === "upwork") {
    personalInfo = extractUpworkPersonalInfo();
    skills = extractUpworkSkills();
  }

  if (!company) {
    personalInfo.ProfileLink = window.location.href.split("?")[0];

    const urlParts = window.location.href.split("/");
    const baseProfileUrl = `${urlParts[0]}//${urlParts[2]}/${urlParts[3]}/${urlParts[4]}/`;

    personalInfo.ProfileLink = baseProfileUrl;

    const profile = {
      origin,
      company,
      personalInfo,
      workExperience,
      educationDetails,
      licenseCertification,
      skills,
      services,
      scrapSkills,
      // tags,
    };

    sendProfileToBackground(profile, company);
  }
};

const sendProfileToBackground = (personalInfo, company) => {
  let profile;
  if (company) {
    profile = {
      origin: "linkedin",
      company,
      personalInfo,
      workExperience: [],
      educationDetails: [],
      licenseCertification: [],
      skills: [],
    };
  } else {
    profile = {
      origin: "linkedin",
      company,
      ...personalInfo,
      // workExperience: [],
      // educationDetails: [],
      // licenseCertification: [],
      // skills: [],
    };
  }

  // send the scraped data to the background
  chrome.runtime.sendMessage(
    {
      type: "INFO",
      profile,
    },
    (response) => {}
  );
};

// reading the message from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const origin = message.origin;
  // if it is startScraping, then the scrap will start
  if (message.action === "startScraping") {
    extractProfileInfo(origin);
  }
});

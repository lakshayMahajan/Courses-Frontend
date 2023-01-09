//global variables and functions

//counselor contacts
export const counselorData = [
  {
    name: "Nancy Herndon",
    role: "Director and Department Chair",
    email: "nherndon@hse.k12.in.us",
  },
  {
    name: "Rob Cutter (A - Bron)",
    role: "Counselor",
    email: "rcutter@hse.k12.in.us",
  },
  {
    name: "Greg Davidson (Broo - De)",
    role: "Counselor",
    email: "gdavidson@hse.k12.in.us",
  },
  {
    name: "Heather Flake (Dh - Gra)",
    role: "Counselor",
    email: "hflake@hse.k12.in.us",
  },
  {
    name: "Kyle Poyer (Gre - Ja)",
    role: "Counselor",
    email: "kpoyer@hse.k12.in.us",
  },
  {
    name: "Mary Rager (Je - L)",
    role: "Counselor",
    email: "mrager@hse.k12.in.us",
  },
  {
    name: "Brian Pletcher (M - N)",
    role: "Counselor",
    email: "bpletcher@hse.k12.in.us",
  },
  {
    name: "Bill Zoeller (O - R)",
    role: "Counselor",
    email: "WZoeller@hse.k12.in.us",
  },
  {
    name: "Kris Harney (S - Ta)",
    role: "Counselor",
    email: "kharney@hse.k12.in.us",
  },
  {
    name: "Vicki Gray (Te - Z)",
    role: "Counselor",
    email: "vgray@hse.k12.in.us",
  },
  {
    name: "Mariam Jones",
    role: "Secretary",
    email: "mjones@hse.k12.in.us",
  },
  {
    name: "Lisa Woolsey",
    role: "Secretary",
    email: "lwoolsey@hse.k12.in.us",
  },
];

//grades displayed on dropdowns, does not change student's feilds
export const filterGrades = ["Freshman", "Sophomore", "Junior", "Senior"];

//checks for errors when creating and editing courses
export const errorCheck = (original, form, classContext) => {
  if (original) {
    for (var i = 0; i < classContext.length; i++) {
      if (classContext[i].url === form.url && form.url !== original.url) {
        return false;
      }
    }
  } else {
    for (var i = 0; i < classContext.length; i++) {
      if (classContext[i].url === form.url) {
        return false;
      }
    }
  }
  return (
    form.url.indexOf(" ") === -1 &&
    form.url &&
    form.name &&
    form.description &&
    form.requirements &&
    form.course_id
  );
};

//class to year converter
export const yearConverter = (clas) => {
  if (clas == 12) {
    return "Senior";
  } else if (clas == 11) {
    return "Junior";
  } else if (clas == 10) {
    return "Sophomore";
  } else if (clas == 9) {
    return "Freshman";
  }
};

//sets the checkContext for stats calculations
export const displayCheck = (courses, diploma) => {
  var mScNError = false;
  var weight = 0.0;
  var semesters = 0;
  var credits = 0;

  const maxSemesterCheck = {};
  const courseNumCheck = [];
  const data = [];

  for (const [year, yearVal] of Object.entries(courses)) {
    for (const [sem, semVal] of Object.entries(yearVal)) {
      courseNumCheck.push(semVal.length);
      if (semVal.length > 7) {
        mScNError = true;
      }
      if (semVal.length !== 0) {
        semesters++;
        for (const x in semVal) {
          var name = semVal[x].name;

          for (const ind in semVal[x].credit) {
            data.push(semVal[x].credit[ind]);
          }

          if (maxSemesterCheck.hasOwnProperty(name)) {
            maxSemesterCheck[name][0] += 1;
          } else {
            maxSemesterCheck[name] = [1, semVal[x].max_semesters];
          }

          weight += semVal[x].weight;
        }
      }
    }
  }

  //remove useless out of maxSemesterCheck
  for (const [name, courseVal] of Object.entries(maxSemesterCheck)) {
    if (courseVal[0] <= courseVal[1]) {
      delete maxSemesterCheck[name];
    } else {
      mScNError = true;
    }
  }

  console.log(diploma);
  const out = [];
  diploma.subjects.map((subject) => {
    var counter = 0;

    var startInd = 0;
    while (getCreditInd(data, subject.name, startInd) !== -1) {
      var ind = getCreditInd(data, subject.name, startInd);
      startInd = ind + 1;
      data.splice(ind, 1);
      counter++;
    }

    if (counter > subject.credits) {
      credits += subject.credits;
    } else {
      credits += counter;
    }

    out.push([subject.name, counter, subject.credits]);
  });

  return {
    weight,
    semesters,
    credits,
    out,
    maxSemesterCheck,
    courseNumCheck,
    mScNError,
  };
};

const getCreditInd = (creditList, subjectName, startInd) => {
  for (var x = startInd; x < creditList.length; x++) {
    if (
      creditList[x].toLowerCase().indexOf(subjectName.toLowerCase()) !== -1 ||
      subjectName.toLowerCase().indexOf(creditList[x].toLowerCase()) !== -1
    ) {
      return x;
    }
  }
  return -1;
};

import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { endOfToday } from 'date-fns';
import { subDays } from 'date-fns';
import {env} from 'hono/adapter'
import { signupMIddleware } from './middlewares/signup_validator';
import { signinMIddleware } from './middlewares/signin_validator';
import { authtoken } from './middlewares/authorizetoken';
import { decode, sign, verify } from 'hono/jwt'
import { cors } from 'hono/cors';
import z from 'zod'
//@ts-ignore

import {OpenAI} from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai';
import { tr } from 'date-fns/locale';






const app = new Hono();
app.use(cors());

async function jwtsign(username:string):Promise<string>{
  const payload = {
    username:username
  }
  const secret = 'mySecretKey'
  const token = await sign(payload, secret)
  return token;
}









app.post('/varification', async (c) => {
  const body = await c.req.json();
  console.log(body);
  //@ts-ignore
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());

  const emailSchema = z.object({
    email: z.string().email(),
  });

  function generateVerificationCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  try {
    const validation = emailSchema.safeParse(body);
    if (!validation.success) {
      return c.json({ error: 'Invalid email format',success:false }, 400);
    }
    const code = generateVerificationCode();
    const email = body.email.trim();
    //const trimmedStr = str.trim();
    const resp = {
      email,
      code
    }
    
    const response2 = await fetch('https://mailer-codedebugger-ri1cytkrg-hamdids-projects.vercel.app/sendcode', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(resp), // Send data1 as JSON body
          });
    const result = await response2.json();
    try {
      const res = await prisma.emailwithcode.upsert({
        where: { email: email }, // Check if email already exists
        update: { code: code }, // If exists, update the code
        create: { email: email, code: code }, // If doesn't exist, create a new record
        select: { id: true },
      });
      
      return c.json({
        res: res,
        success:true
      });
    } catch (error) {
      console.error('Error creating/updating record:', error);
      return c.json({message:'Internal Server Error',success:true}, 500);
    } finally {
      prisma.$disconnect();
    }
    //console.log(result);

  } catch (error) {
    console.error('Error in verifying', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});




app.post('/varifycode', async (c) => {
  const body = await c.req.json();
  console.log(body);
  //@ts-ignore
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const code = body.code;
    const email = body.email.trim();
    try {
      const res = await prisma.emailwithcode.findUnique({
        where: { email: email }, // Check if email already exists
        select: { id: true, code:true},
      });

      if(res && res.code===code){
        return c.json({
          success:true
        });
      }else{
        return c.json({
          success:false
        });
      }
      
      
    } catch (error) {
      console.error('Error creating/updating record:', error);
      return c.json({message:'Internal Server Error',success:false}, 500);
    } finally {
      prisma.$disconnect();
    }
    //console.log(result);

  } catch (error) {
    console.error('Error in verifying', error);
    return c.json({ error: 'Internal Server Error',success:false }, 500);
  }
});






app.get('/', async (c) => {
  return c.json({
    message:"hi"
  })
})



app.post('/signup',signupMIddleware, async (c) => {
  const b = await c.req.json();
  const { DATABASE_URL } = env<{ DATABASE_URL:string }>(c)
  
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const res = await prisma.student.create({
      data:{
        name: b.name,
        username: b.username,
        password:b.password,
      },
      select:{
        id:true,
        name:true,
        username:true,
      }
    });
    const token = await jwtsign(b.username);
    return c.json({
      res: res,
      token:token,
      success:true
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return c.json({
      success:false,
      error
    }, 500);
  }finally{
    prisma.$disconnect();
  }
});


app.post('/signin',signinMIddleware, async (c:any) => {
  
  const b = await c.req.json();
  const token = await jwtsign(b.username);
  const allData = c.get("alluserinfo");
  

  return c.json({
    token:token,
    data:allData,
    success:true
  })  
});







// app.post('/addstudentdetails', authtoken, async (c: any) => {
//   const body = await c.req.json();
//   const b = body.surveyData;
//   const x = await c.get('userinfo');
//   const id = x.id;
//   const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
//   const prisma = new PrismaClient({
//     datasourceUrl: DATABASE_URL,
//   }).$extends(withAccelerate());

//   try {
//     const res = await prisma.student_details.upsert({
//       where: {
//         student_id: id,
//       },
//       update: {
//         gpa: b.gpa,
//         fav_subjects: b.fav_subjects,
//         dreamColleges: b.dreamColleges,
//         current_majors: b.current_majors,
//         majors: b.majors,
//         extracurriculars: b.extracurriculars,
//         sports: b.sports,
//         awards: b.awards,
//         satScore: b.satScore,
//         ab_ib: b.ab_ib,
//         hobbies: b.hobbies,
//         stayLocal: b.stayLocal,
//         achievements: b.achievements,
//         budget: b.budget,
//         school: b.school,
//         opportunities: b.opportunities,
//         city: b.city,
//         isUSResident: b.isUSResident,
//         state: b.state,
//       },
//       create: {
//         student_id: id,
//         gpa: b.gpa,
//         fav_subjects: b.fav_subjects,
//         dreamColleges: b.dreamColleges,
//         current_majors: b.current_majors,
//         majors: b.majors,
//         extracurriculars: b.extracurriculars,
//         sports: b.sports,
//         awards: b.awards,
//         satScore: b.satScore,
//         ab_ib: b.ab_ib,
//         hobbies: b.hobbies,
//         stayLocal: b.stayLocal,
//         achievements: b.achievements,
//         budget: b.budget,
//         school: b.school,
//         opportunities: b.opportunities,
//         city: b.city,
//         isUSResident: b.isUSResident,
//         state: b.state,
//       },
//       select: {
//         id,
//       },
//     });
//     return c.json({
//       res: res,
//       success: true,
//     });
//   } catch (error) {
//     console.error('Error upserting student details:', error);
//     return c.json({
//       error: "Internal Server Error",
//       success: false,
//     }, 500);
//   } finally {
//     await prisma.$disconnect();
//   }
// });




// app.post('/getstudentdetails',authtoken ,async (c: any) => {
//   const body = await c.req.json();
//   const b = body.surveyData;
//   const x = await c.get('userinfo');
//   const id = x.id;
//   // return c.json({
//   //       b,
//   //       success: true,
//   //     });
//   const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
//   const prisma = new PrismaClient({
//     datasourceUrl: DATABASE_URL,
//   }).$extends(withAccelerate());

//   try {
//     const res = await prisma.student_details.findUnique({
//       //@ts-ignore
//       where:{
//         student_id:id
//       },
//       select: {
//         student_id:true,
//         gpa: true,
//         fav_subjects: true,
//         dreamColleges: true,
//         current_majors: true,
//         majors: true,
//         extracurriculars: true,
//         sports: true,
//         awards: true,
//         satScore: true,
//         ab_ib: true,
//         hobbies: true,
//         stayLocal: true,
//         achievements: true,
//         budget: true,
//         school: true,
//         opportunities: true,
//         city: true,
//         isUSResident: true,
//         state: true,
//       }
//     });
//     return c.json({
//       res: res,
//       success: true,
//     });
//   } catch (error) {
//     console.error('Error inviting user to project:', error);
//     return c.json({
//       error: "Internal Server Error",
//       success: false,
//   }, 500);
//   } finally {
//     await prisma.$disconnect();
//   }
// });


// app.post('/savestudentinterests', authtoken, async (c: any) => {
//   const body = await c.req.json();
//   const x = await c.get('userinfo');
//   const id = x.id;
//   const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
//   const prisma = new PrismaClient({
//     datasourceUrl: DATABASE_URL,
//   }).$extends(withAccelerate());

//   try {
//     const res = await prisma.student_interests.upsert({
//       //@ts-ignore
//       where: {
//         student_id: id
//       },
//       update: {
//         interests: body.interests 
//       },
//       create: {
//         student_id: id,
//         interests: body.interests
//       },
//       select: {
//         interests: true
//       }
//     });
//     return c.json({
//       res: res,
//       success: true,
//     });
//   } catch (error) {
//     console.error('Error inviting user to project:', error);
//     return c.json({
//       error: "Internal Server Error",
//       success: false,
//     }, 500);
//   } finally {
//     await prisma.$disconnect();
//   }
// });



// app.post('/getstudentinterests',authtoken ,async (c: any) => {
//   const body = await c.req.json();
//   const b = body.surveyData;
//   const x = await c.get('userinfo');
//   const id = x.id;
//   // return c.json({
//   //       b,
//   //       success: true,
//   //     });
//   const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
//   const prisma = new PrismaClient({
//     datasourceUrl: DATABASE_URL,
//   }).$extends(withAccelerate());

//   try {
//     const res = await prisma.student_interests.findUnique({
//       //@ts-ignore
//       where:{
//         student_id:id
//       },
//       select: {
//         interests:true
//       }
//     });
//     return c.json({
//       res: res,
//       success: true,
//     });
//   } catch (error) {
//     console.error('Error inviting user to project:', error);
//     return c.json({
//       error: "Internal Server Error",
//       success: false,
//   }, 500);
//   } finally {
//     await prisma.$disconnect();
//   }
// });



// app.post('/addevent', authtoken, async (c:any) => {
//   const x = await c.get('userinfo'); // Assuming this retrieves user info 
//   const body = await c.req.json();
//   const userId = x.id;

//   const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
//   const prisma = new PrismaClient({
//     datasourceUrl: DATABASE_URL,
//   }).$extends(withAccelerate());

//   try {
//     const res = await prisma.calenderevents.create({
//       data:{
//         student_id: userId,
//         title :body.title,
//         description: body.description,
//         color:body.color,
//         start:body.start,
//         end:body.end
//       },
//       select:{
//         id:true
//       }
//     });
//     return c.json({
//       res: res,
//       success:true
//     });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     return c.json({
//       res: error,
//       success:false
//     })
//   }finally{
//     prisma.$disconnect();
//   }
// });
// app.get('/getevents', authtoken, async (c:any) => {
//   const x = await c.get('userinfo'); // Assuming this retrieves user info 
//   const userId = x.id;

//   const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
//   const prisma = new PrismaClient({
//     datasourceUrl: DATABASE_URL,
//   }).$extends(withAccelerate());

//   try {
//     const res = await prisma.calenderevents.findMany({
//       where:{
//         student_id: userId
//       },
//       select:{
//         id:true,
//         title:true,
//         description:true,
//         color:true,
//         start:true,
//         end:true
//       }
//     });
//     return c.json({
//       res: res,
//       success:true
//     });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     return c.json({
//       res: error,
//       success:false
//     })
//   }finally{
//     prisma.$disconnect();
//   }
// });






// app.post('/deleteevents', authtoken, async (c:any) => {
//   const x = await c.get('userinfo'); // Assuming this retrieves user info 
//   const body = await c.req.json();
//   //const userId = x.id;

//   const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
//   const prisma = new PrismaClient({
//     datasourceUrl: DATABASE_URL,
//   }).$extends(withAccelerate());

//   try {
//     const res = await prisma.calenderevents.delete({
//       where:{
//         id: body.event_id
//       },
//       select:{
//         id:true,
//       }
//     });
//     return c.json({
//       res: res,
//       success:true
//     });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     return c.json({
//       res: error,
//       success:false
//     })
//   }finally{
//     prisma.$disconnect();
//   }
// });

// app.post('/getresponses', authtoken, async (c:any) => {
//   const x = await c.get('userinfo'); // Assuming this retrieves user info 
//   const b = await c.req.json();
//   const body = b.question;
//   console.log(body);
//   const userId = x.id;

//   const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
//   const { OPENAI_KEY } = env<{ OPENAI_KEY: string }>(c);
  
//   const openai = new OpenAI({
//     apiKey: OPENAI_KEY,
//   });
//   const prisma = new PrismaClient({
//     datasourceUrl: DATABASE_URL,
//   }).$extends(withAccelerate());

  

// //@ts-ignore
//   async function generatemessage(){
//     try{
//       const res = await prisma.student_details.findUnique({
//         where:{
//           student_id:userId
//         },
//         select: {
//           student_id: true,
//           gpa: true,
//           fav_subjects: true,
//           satScore: true,
//           ab_ib: true,
//           dreamColleges: true,
//           current_majors: true,
//           majors: true,
//           extracurriculars: true,
//           sports: true,
//           awards: true,
//           achievements: true,
//           hobbies: true,
//           budget: true,
//           state: true,
//           city: true,
//           stayLocal: true,
//           school: true,
//           opportunities: true,
//           isUSResident: true
//         }
//       })

//       const systemMessage = `You are an advanced AI ${body.ROLE} counselor whose primary responsibility is to guide high school students in building the strongest extracurricular profiles to boost their chances of being accepted into their dream universities. Your expertise lies in identifying activities, clubs, internships, and programs that help students demonstrate the key qualities college admissions officers look for: leadership, teamwork, individuality, service, and time management. You will be provided with students’ interests, career goals, and dream schools, and from this information, you will need to recommend relevant programs. Always respond in JSON format with this exact structure: 
//         {
//           "${body.RESPONSE_KEY}": [
//             {
//               "title": "Item title",
//               "description": "Detailed explanation",
//               "marked": false,
//               ${body.ADDITIONAL_FIELDS}
//             }
//           ]
//         }
        
//         Personalize using the student’s information:
//         GPA: ${res && res.gpa ? res.gpa : "Data unavailable"}, 
//         SAT: ${res && res.satScore ? res.satScore : "Data unavailable"}, 
//         State: ${res && res.state ? res.state : "Data unavailable"}, 
//         City: ${res && res.city ? res.city : "Data unavailable"}, 
//         Dream Colleges: ${res && res.dreamColleges ? res.dreamColleges : "Data unavailable"}, 
//         Current Majors: ${res && res.current_majors ? res.current_majors : "Data unavailable"}, 
//         Interested Majors: ${res && res.majors ? res.majors : "Data unavailable"}, 
//         Extracurriculars: ${res && res.extracurriculars ? res.extracurriculars : "Data unavailable"}, 
//         Sports: ${res && res.sports ? res.sports : "Data unavailable"}, 
//         Awards: ${res && res.awards ? res.awards : "Data unavailable"}, 
//         Achievements: ${res && res.achievements ? res.achievements : "Data unavailable"}, 
//         Hobbies: ${res && res.hobbies ? res.hobbies : "Data unavailable"}, 
//         Budget: ${res && res.budget ? res.budget : "Data unavailable"}, 
//         School: ${res && res.school ? res.school : "Data unavailable"}, 
//         Stay Local: ${res && res.stayLocal !== undefined ? (res.stayLocal ? "Yes" : "No") : "Data unavailable"}, 
//         Opportunities: ${res && res.opportunities !== undefined ? (res.opportunities ? "Yes" : "No") : "Data unavailable"}, 
//         US Resident: ${res && res.isUSResident ? res.isUSResident : "Data unavailable"}`;

//     return systemMessage;
      
//     }catch{
//       return c.json({
//         error:"cant fetch student details",
//         success:false
//       })
//     }
    
//   }
//   const systemMessage = await generatemessage();
  
//   const userPrompt = body.question;

//   async function getresponse(prompt:string) {
//     try {
//       console.log(systemMessage);
//       const response = await openai.chat.completions.create({
//         model: "gpt-4-turbo", 
//         messages: [
//           { role: "system", content: systemMessage },
//           { role: "user", content: prompt }
//         ],
//         response_format: { type: "json_object" }, // Force JSON output
//         temperature: 0.3 
//       });
      
//       //@ts-ignore
//       return JSON.parse(response.choices[0].message.content);
      
//     } catch (error) {
//       console.error("Error fetching response:", error);
//       return { error: "Failed to generate response" };
//     }
//   }
//   try{
//     const openairesponse = await getresponse(userPrompt);
//     console.log(openairesponse);
//     return c.json({
//       res: openairesponse,
//       success:true
//     });
//   }catch(error){
//     return c.json({
//       error,
//       success:false
//     });
//   }
// });






// app.post('/getprograms', authtoken, async (c:any) => {
//   const x = await c.get('userinfo'); // Assuming this retrieves user info 
//   const body = await c.req.json();
//   const userId = x.id;

//   const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
//   const { OPENAI_KEY } = env<{ OPENAI_KEY: string }>(c);
  
//   const openai = new OpenAI({
//     apiKey: OPENAI_KEY,
//   });
//   const prisma = new PrismaClient({
//     datasourceUrl: DATABASE_URL,
//   }).$extends(withAccelerate());

  

// //@ts-ignore
//   async function generatemessage(){
//     try{
//       const res = await prisma.student_details.findUnique({
//         where:{
//           student_id:userId
//         },
//         select: {
//           student_id: true,
//           gpa: true,
//           fav_subjects: true,
//           satScore: true,
//           ab_ib: true,
//           dreamColleges: true,
//           current_majors: true,
//           majors: true,
//           extracurriculars: true,
//           sports: true,
//           awards: true,
//           achievements: true,
//           hobbies: true,
//           budget: true,
//           state: true,
//           city: true,
//           stayLocal: true,
//           school: true,
//           opportunities: true,
//           isUSResident: true
//         }
//       })

//       const systemMessage = `You are an advanced AI college counselor whose primary responsibility is to guide high school students in building the strongest extracurricular profiles to boost their chances of being accepted into their dream universities. Your expertise lies in identifying activities, clubs, internships, and programs that help students demonstrate the key qualities college admissions officers look for: leadership, teamwork, individuality, service, and time management. You will be provided with students’ interests, career goals, and dream schools, and from this information, you will need to recommend relevant programs.

//       Your recommendations must include:

//       Program Name: Provide the official name of the extracurricular program, club, internship, or activity.
//       Description: Give a concise yet detailed description of the program, explaining how it aligns with the student’s interests and why it will be beneficial for college applications. The description should be 50-100 words and should specifically highlight any opportunities for leadership, teamwork, skill development, or contributions to the community.
//       Link: Include a working hyperlink to the program’s official page so the student can access more details or apply directly.
//       Exact Dates: List the application deadlines, as well as the start and end dates of the program if applicable. This helps the student plan ahead and manage their time effectively.
//       Program Location: If relevant, mention whether the program is local, virtual, or in-person with specific locations, and whether there are any travel or accommodation considerations.
//       Requirements: Clearly mention any eligibility criteria (e.g., grade level, prior experience, GPA requirements) or materials required for application (e.g., recommendation letters, essays, portfolios).
//       Costs and Financial Aid: Mention any fees associated with the program and whether there are options for scholarships or financial aid.
//       Additional Guidelines and Context:

//       Key Themes for Admissions: Colleges, especially highly selective institutions like Ivy League schools, value students who are well-rounded and have demonstrated initiative in a variety of settings. When making recommendations, prioritize programs that highlight the following:

//       Leadership Opportunities: Programs where students can lead teams, spearhead initiatives, or hold positions of responsibility.
//       Teamwork and Collaboration: Activities that emphasize working with others in a group setting (e.g., debate teams, student government, or project-based internships).
//       Service and Impact on Community: Volunteering programs, community service organizations, or other activities where students can make a measurable difference.
//       Individuality and Passion: Look for opportunities that reflect the student’s unique interests or creative outlets, whether through the arts, hobbies, or specialized academic fields.
//       Sustained Commitment: Favor programs where the student can engage over multiple years, as this demonstrates dedication and growth.
//       Balancing Interests: Ensure the student’s profile isn’t overloaded with unrelated activities. While being well-rounded is important, the student should also show a deep and genuine interest in one or two areas related to their intended major or career goals. If the student is interested in economics, for example, suggest programs like internships in finance, serving as a treasurer of a club, or economics-related summer camps. For engineering, focus on STEM clubs, robotics teams, or coding boot camps.

//       Program Variety: Offer a mix of options, including:

//       Academic Clubs: (e.g., debate, science Olympiad, math leagues) for intellectual growth.
//       Athletics: (e.g., varsity or intramural sports) for leadership and teamwork.
//       Volunteering and Community Service: (e.g., local charities, food banks) to demonstrate a commitment to service.
//       Internships or Career-Oriented Programs: (e.g., research programs, tech startups) to align with career goals.
//       Artistic or Creative Pursuits: (e.g., writing, theater, visual arts) to show well-roundedness and individuality.
//       Leadership Roles: Recommend programs where students can take on leadership roles, such as being president of a club or team captain, and explain how this will make them stand out.
//       College Admissions Insights:

//       Highly Selective Schools (e.g., Ivy Leagues, Stanford, MIT): When recommending programs for students aiming for highly selective schools, focus on activities that display exceptional leadership or uniqueness, such as starting a nonprofit, launching significant initiatives, or excelling in national competitions.
//       Balanced Approach: Make sure the student’s profile reflects a balance between academics and extracurriculars. Students should not overextend themselves but rather focus on excelling in a few key areas.
//       Employment and Work Experience: Acknowledge that not all students have access to traditional extracurricular activities. In these cases, treat employment (e.g., part-time jobs, internships) as a valuable extracurricular and highlight how work experience can build skills like responsibility, teamwork, and problem-solving.
//       Program Examples: When recommending, provide specific examples of:

//       Leadership Programs: National Student Leadership Conference, Model UN, and HOBY Leadership programs.
//       STEM Programs: MIT Summer Science Program, Code.org Internships, or FIRST Robotics.
//       Community Service: Volunteering at local food banks, Red Cross youth volunteer programs, or Habitat for Humanity.
//       Arts Programs: National Youth Theatre, Scholastic Art & Writing Awards, or the Young Arts program.
//       Customization Based on Interests: Tailor your recommendations based on the student’s specific goals and passions. For instance, if a student is interested in law, focus on debate teams, mock trials, or internships at legal firms. If they’re interested in healthcare, suggest HOSA leadership, volunteer programs at hospitals, or medical research internships.

//       Timeline Considerations: Make sure your recommendations are timely and allow students to plan their schedules in advance. When possible, include opportunities that are available during school breaks or summer, so as not to interfere with academic performance.
//       Always respond in JSON format with this exact structure: 
//         {
//           "programs": [
//             {
//               "title": "Program Name:",
//               "description": "Detailed Description",
//               "link": "program Link",
//               "dates":[{"application_deadline":"program application deadline"},{"Program Dates":"other Program Dates in string format with info"}],
//               "location": "Program Location",
//               "requirements" : "program requirements and eligibility criteria",
//               "costs_and_financial_aid" : "programs cost in USD and financial aid details"
//             }
//           ]
//         }
        
//         Personalize using the student’s information:
//         GPA: ${res && res.gpa ? res.gpa : "Data unavailable"}, 
//         SAT: ${res && res.satScore ? res.satScore : "Data unavailable"}, 
//         State: ${res && res.state ? res.state : "Data unavailable"}, 
//         City: ${res && res.city ? res.city : "Data unavailable"}, 
//         Dream Colleges: ${res && res.dreamColleges ? res.dreamColleges : "Data unavailable"}, 
//         Current Majors: ${res && res.current_majors ? res.current_majors : "Data unavailable"}, 
//         Interested Majors: ${res && res.majors ? res.majors : "Data unavailable"}, 
//         Extracurriculars: ${res && res.extracurriculars ? res.extracurriculars : "Data unavailable"}, 
//         Sports: ${res && res.sports ? res.sports : "Data unavailable"}, 
//         Awards: ${res && res.awards ? res.awards : "Data unavailable"}, 
//         Achievements: ${res && res.achievements ? res.achievements : "Data unavailable"}, 
//         Hobbies: ${res && res.hobbies ? res.hobbies : "Data unavailable"}, 
//         Budget: ${res && res.budget ? res.budget : "Data unavailable"}, 
//         School: ${res && res.school ? res.school : "Data unavailable"}, 
//         Stay Local: ${res && res.stayLocal !== undefined ? (res.stayLocal ? "Yes" : "No") : "Data unavailable"}, 
//         Opportunities: ${res && res.opportunities !== undefined ? (res.opportunities ? "Yes" : "No") : "Data unavailable"}, 
//         US Resident: ${res && res.isUSResident ? res.isUSResident : "Data unavailable"}`;

//     return systemMessage;
      
//     }catch{
//       return c.json({
//         error:"cant fetch student details",
//         success:false
//       })
//     }
    
//   }
//   const systemMessage = await generatemessage();
  
//   const userPrompt = "Help me search for the best programs suitable for me";

//   async function getresponse(prompt:string) {
//     try {
//       console.log(systemMessage);
//       const response = await openai.chat.completions.create({
//         model: "gpt-4-turbo", 
//         messages: [
//           { role: "system", content: systemMessage },
//           { role: "user", content: prompt }
//         ],
//         response_format: { type: "json_object" }, // Force JSON output
//         temperature: 0.3 
//       });
      
//       //@ts-ignore
//       return JSON.parse(response.choices[0].message.content);
      
//     } catch (error) {
//       console.error("Error fetching learning path:", error);
//       return { error: "Failed to generate learning path" };
//     }
//   }
//   try{
//     const openairesponse = await getresponse(userPrompt);
//     return c.json({
//       res: openairesponse,
//       success:true
//     });
//   }catch(error){
//     return c.json({
//       error,
//       success:false
//     });
//   }
// });
// // app.post('/getlearningpath', authtoken, async (c:any) => {
// //   const x = await c.get('userinfo'); // Assuming this retrieves user info 
// //   const body = await c.req.json();
// //   //const userId = x.id;

// //   const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
// //   const { OPENAI_KEY } = env<{ OPENAI_KEY: string }>(c);
// //   console.log(OPENAI_KEY);
// //   const openai = new OpenAI({
// //     apiKey: OPENAI_KEY,
// //   });
// //   const prisma = new PrismaClient({
// //     datasourceUrl: DATABASE_URL,
// //   }).$extends(withAccelerate());


// //   const systemMessage = `You are a career path generator. Always respond in JSON format with this exact structure:
// //   {
// //     "stages": [
// //       {
// //         "stage": "which stage is it like 1 ,2 ..etc"
// //         "title": "Stage title",
// //         "description": "Detailed explanation",
// //         "deadline": "Suggested timeline",
// //         "resources":[
// //           {
// //             "info": "resource info",
// //             "link": "resource info"
// //           }
// //         ]
// //       }
// //     ]
// //   }
// //   Keep deadlines in MM/YYYY format. Use professional but approachable language.`;

// //   const userPrompt = "Give me a 4 to 15-stage path to learn / achieve "+ body.extracurricular + "only give required stages and well informed ";

// //   async function getLearningPath(prompt:string) {
// //     try {
// //       const response = await openai.chat.completions.create({
// //         model: "gpt-4-turbo", // or "gpt-3.5-turbo"
// //         messages: [
// //           { role: "system", content: systemMessage },
// //           { role: "user", content: prompt }
// //         ],
// //         response_format: { type: "json_object" }, // Force JSON output
// //         temperature: 0.3 // For more deterministic output
// //       });
// //       //@ts-ignore
// //       return JSON.parse(response.choices[0].message.content);
      
// //     } catch (error) {
// //       console.error("Error fetching learning path:", error);
// //       return { error: "Failed to generate learning path" };
// //     }
// //   }
// //   try{
// //     const learningPath = await getLearningPath(userPrompt);
// //     return c.json({
// //       learningPath: learningPath,
// //       success:true
// //     });
// //   }catch(error){
// //     return c.json({
// //       error,
// //       success:false
// //     });
// //   }
// // });

// // app.post('/getlearningpath', async (c: any) => {
// //   const x = await c.get('userinfo');
// //   const body = await c.req.json();
  
// //   const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
// //   const { GEMINI_KEY } = env<{ GEMINI_KEY: string }>(c);
// //   console.log(GEMINI_KEY);
// //   // Initialize Gemini
// //   //@ts-ignore
// //   const gemini = new GoogleGenerativeAI({
// //     apiKey: GEMINI_KEY,
// //   });

// //   // Configure model with JSON response format
// //   const generationConfig = {
// //     temperature: 0.7,
// //     topP: 1,
// //     responseMimeType: "application/json",
// //   };

// //   const model = gemini.getGenerativeModel({ 
// //     model: "gemini-1.5-pro-latest",
// //     generationConfig,
// //   });

// //   const systemMessage = `You are a career path generator. Always respond in JSON format with this exact structure:
// //   {
// //     "stages": [
// //       {
// //         "stage": "stage number",
// //         "title": "Stage title",
// //         "description": "Detailed explanation",
// //         "deadline": "MM/YYYY",
// //         "resources": [
// //           {
// //             "info": "Resource name",
// //             "link": "URL (or 'No link available' if none)"
// //           }
// //         ]
// //       }
// //     ]
// //   }
// //   Use professional but approachable language. Include 4-15 stages.`;

// //   const userPrompt = `Generate a learning path for: ${body.extracurricular}. Focus on essential, practical steps.`;

// //   try {
// //     // Generate content with combined prompts
// //     const result = await model.generateContent({
// //       contents: [{
// //         role: "user",
// //         parts: [{
// //           text: `${systemMessage}\n\n${userPrompt}`
// //         }]
// //       }]
// //     });

// //     const response = await result.response;
// //     const textResponse = response.text();

// //     // Parse and validate response
// //     const parsedResponse = JSON.parse(textResponse);
    
// //     // Validate JSON structure
// //     if (!parsedResponse.stages || !Array.isArray(parsedResponse.stages)) {
// //       throw new Error("Invalid response format from AI model");
// //     }

// //     return c.json({
// //       learningPath: parsedResponse,
// //       success: true
// //     });

// //   } catch (error) {
// //     console.error("Error in /getlearningpath:", error);
// //     return c.json({
// //       error: error instanceof Error ? error.message : "Failed to generate learning path",
// //       success: false
// //     }, 500);
// //   }
// // });



app.post('/debugcode',authtoken, async (c: any) => {
  try {
    const x = await c.get('userinfo'); 
    const userId = x.id;
    const { DATABASE_URL } = env<{ DATABASE_URL:string }>(c)
  
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());

    const body = await c.req.json();
    const { GEMINI_KEY } = env<{ GEMINI_KEY: string }>(c);

    // Validate API key format first
    if (!GEMINI_KEY?.startsWith('AIzaSy')) {
      throw new Error('Invalid Gemini API key format');
    }

    
    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      generationConfig: {
        temperature: 0.7,
        topP: 1,
        responseMimeType: "application/json"
      }
    });

    const systemPrompt = `You are the best code debugger use all your resources to quickly debug the code and return the fully corrected code, also give a title the code related to what the code really does or what problem the code solves in 2 to 3 words. Respond in strict JSON format:
    {
      "code": {
        "code_title": string,
        "correct_code": string,
        "explaination": string,
      }
    }`;

    const userPrompt = `debug my code and return the corrected code with proper indentation: ${body.code}`;

    
    //@ts-ignore
    const result = await model.generateContent({
      contents: [{
        parts: [{
          text: `${systemPrompt}\n${userPrompt}`
        }]
      }]
    });

    const response = await result.response;
    const text = response.text();
    
    const objres = JSON.parse(text);
    if (!text) throw new Error('Empty response from Gemini');

    try {
      const res = await prisma.code.create({
        //@ts-ignore
        data:{
          title: objres.code.code_title,
          code: body.code,
          debugged:objres.code.correct_code,
          info: objres.code.explaination,
          student_id: userId,
          session_id: body.session
        },
        select:{
          id:true,
        }
      });
      
    } catch (error) {
      console.error('Error saving code:', error);
      
    }finally{
      prisma.$disconnect();
    }

    return c.json({
      code: JSON.parse(text),
      success: true
    });

  } catch (error) {
    console.error('API Error:', error);
    return c.json({
      error: error instanceof Error ? error.message : 'Processing failed',
      success: false
    }, 500);
  }
});




app.post('/getcodes',authtoken, async (c: any) => {
  try {
    const x = await c.get('userinfo'); 
    const userId = x.id;
    const { DATABASE_URL } = env<{ DATABASE_URL:string }>(c)
  
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());

    const body = await c.req.json();

    try {
      const res = await prisma.code.findMany({
        where:{
          student_id: userId,
          session_id:body.session
        },
        select:{
          id:true,
          title:true,
          debugged:true,
          code:true,
          info:true
        }
      });

      return c.json({
        code: res,
        success: true
      });
      
    } catch (error) {
      console.error('Error saving code:', error);
      
    }finally{
      prisma.$disconnect();
    }


  } catch (error) {
    console.error('API Error:', error);
    return c.json({
      error: error instanceof Error ? error.message : 'Processing failed',
      success: false
    }, 500);
  }
});




app.post('/getsessions',authtoken, async (c: any) => {
  try {
    const x = await c.get('userinfo'); 
    const userId = x.id;
    const { DATABASE_URL } = env<{ DATABASE_URL:string }>(c)
  
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());

    const body = await c.req.json();

    try {
      const res = await prisma.session.findMany({
        where: {
          student_id: userId,
        },
        select: {
          id: true,
          name: true,
          created_at: true,
        },
        orderBy: {
          created_at: 'desc', // Order by creation date in descending order
        },
        take: 10, // Limit the result to the 15 most recent
      });
    
      return c.json({
        file: res,
        success: true,
      });
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      await prisma.$disconnect(); // Ensure to disconnect the Prisma client
    }


  } catch (error) {
    console.error('API Error:', error);
    return c.json({
      error: error instanceof Error ? error.message : 'Processing failed',
      success: false
    }, 500);
  }
});





app.post('/updatesessioname',authtoken, async (c: any) => {
  try {
    const x = await c.get('userinfo'); 
    const userId = x.id;
    const { DATABASE_URL } = env<{ DATABASE_URL:string }>(c)
  
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());

    const body = await c.req.json();

    try {
      const res = await prisma.session.update({
        where: {
          id: body.id,
        },
        data:{
          name:body.name,
        },select:{
          id:true,
          name:true
        }
      });
    
      return c.json({
        file: res,
        success: true,
      });
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      await prisma.$disconnect(); // Ensure to disconnect the Prisma client
    }


  } catch (error) {
    console.error('API Error:', error);
    return c.json({
      error: error instanceof Error ? error.message : 'Processing failed',
      success: false
    }, 500);
  }
});





app.post('/newsession',authtoken, async (c: any) => {
  try {
    const x = await c.get('userinfo'); 
    const userId = x.id;
    const { DATABASE_URL } = env<{ DATABASE_URL:string }>(c)
  
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());

    const body = await c.req.json();

    try {
      const res = await prisma.session.create({
        data:{
          name: "",
          student_id: userId,
        },
        select:{
          id:true,
        }
      });

      return c.json({
        res,
        success: true
      });
      
    } catch (error) {
      console.error('Error saving code:', error);
      
    }finally{
      prisma.$disconnect();
    }


  } catch (error) {
    console.error('API Error:', error);
    return c.json({
      error: error instanceof Error ? error.message : 'Processing failed',
      success: false
    }, 500);
  }
});


app.post('/deletesession',authtoken, async (c: any) => {
  try {
    const x = await c.get('userinfo'); 
    const userId = x.id;
    const { DATABASE_URL } = env<{ DATABASE_URL:string }>(c)
  
  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());

    const body = await c.req.json();

    try {
      const res = await prisma.session.delete({
        where:{
          id: body.id,
        },
        select:{
          id:true,
        }
      });

      return c.json({
        res,
        success: true
      });
      
    } catch (error) {
      console.error('Error deleting session:', error);
      
    }finally{
      prisma.$disconnect();
    }


  } catch (error) {
    console.error('API Error:', error);
    return c.json({
      error: error instanceof Error ? error.message : 'Processing failed',
      success: false
    }, 500);
  }
});


export default app;
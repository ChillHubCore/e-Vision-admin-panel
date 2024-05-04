'use client';

import {
  Box,
  Button,
  Fieldset,
  FileInput,
  Group,
  Image,
  Loader,
  NativeSelect,
  Switch,
  TagsInput,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { DatePickerInput, DateValue } from '@mantine/dates';
import { IconFileLike, IconX } from '@tabler/icons-react';
import { useSubmit, useUpload } from '@/lib/hooks';
import { ResumeEntityProps } from './types';
import blackBG from '@/assets/black-bg.png';

export default function ResumeGenerator({
  ResumeData,
  editFlag,
  userFlag,
}: {
  ResumeData: ResumeEntityProps;
  editFlag: boolean;
  userFlag: boolean;
}) {
  const [WorkExperienceData, setWorkExperienceData] = useState<{
    company: string;
    position: string;
    startDate: DateValue;
    endDate: DateValue;
    description: string;
  }>({ company: '', position: '', startDate: null, endDate: null, description: '' });
  const [EducationData, setEducationData] = useState<{
    institution: string;
    degree: string;
    startDate: DateValue;
    endDate: DateValue;
    description: string;
  }>({ institution: '', degree: '', startDate: null, endDate: null, description: '' });
  const [SkillData, setSkillData] = useState<{
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }>({ name: '', level: 'Beginner' });
  const [CertificationData, setCertificationData] = useState<{
    name: string;
    institution: string;
  }>({ name: '', institution: '' });
  const [LanguageData, setLanguageData] = useState<{
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
  }>({ name: '', level: 'Beginner' });
  const [HobbyData, setHobbyData] = useState<string>('');
  const [WorkSampleData, setWorkSampleData] = useState<{
    name: string;
    description: string;
    url: string;
    image: string;
    technologies: string[];
  }>({
    name: '',
    description: '',
    url: '',
    image: '',
    technologies: [],
  });
  const ResumeGeneratorForm = useForm({
    initialValues: {
      title: ResumeData?.title || '',
      workExperience: ResumeData?.workExperience || ([] as ResumeEntityProps['workExperience']),
      education: ResumeData?.education || ([] as ResumeEntityProps['education']),
      skills: ResumeData?.skills || ([] as ResumeEntityProps['skills']),
      certifications: ResumeData?.certifications || ([] as ResumeEntityProps['certifications']),
      languages: ResumeData?.languages || ([] as ResumeEntityProps['languages']),
      hobbies: ResumeData?.hobbies || ([] as ResumeEntityProps['hobbies']),
      workSamples: ResumeData?.workSamples || ([] as ResumeEntityProps['workSamples']),
      active: ResumeData?.active || false,
    },
    validate: {},
  });
  const FormActions = useSubmit();
  const navigate = useNavigate();
  const uploadHandle = useUpload();
  const handleSubmit = () => {
    FormActions.sendRequest(
      '/resume/mine/resume',
      ResumeGeneratorForm,
      ResumeData ? 'put' : 'post',
      'Resume Updated Successfully!',
      'Failed to update resume! Please try again.',
      () => navigate('/team/dashboard/myresume')
    );
  };
  console.log('trace#001', ResumeData);
  return (
    <Box w="100%">
      {ResumeData ? (
        <Title ta="center" order={3}>
          {ResumeData.title}
        </Title>
      ) : (
        <Title ta="center" order={3}>
          Resume has Not been Made Yet!
        </Title>
      )}
      <Box
        component="form"
        onSubmit={ResumeGeneratorForm.onSubmit(handleSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <TextInput
          label="Resume Title"
          placeholder="Write a Title For Your Resume"
          {...ResumeGeneratorForm.getInputProps('title')}
          required
        />
        <Fieldset
          legend="Work Experience"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <TextInput
            label="Company"
            placeholder="Company Name"
            onChange={(e) =>
              setWorkExperienceData({ ...WorkExperienceData, company: e.target.value })
            }
            value={WorkExperienceData.company}
          />
          <TextInput
            label="Position"
            placeholder="Position"
            onChange={(e) =>
              setWorkExperienceData({ ...WorkExperienceData, position: e.target.value })
            }
            value={WorkExperienceData.position}
          />
          <DatePickerInput
            label="Start Date"
            placeholder="Start Date"
            value={WorkExperienceData.startDate}
            onChange={(date) => setWorkExperienceData({ ...WorkExperienceData, startDate: date })}
            rightSection={
              <IconX
                onClick={() => {
                  setWorkExperienceData({ ...WorkExperienceData, startDate: null });
                }}
              />
            }
          />
          <DatePickerInput
            label="End Date"
            placeholder="End Date"
            value={WorkExperienceData.endDate}
            onChange={(date) => setWorkExperienceData({ ...WorkExperienceData, endDate: date })}
            rightSection={
              <IconX
                onClick={() => {
                  setWorkExperienceData({ ...WorkExperienceData, endDate: null });
                }}
              />
            }
          />
          <Textarea
            label="Description"
            placeholder="Description"
            onChange={(e) =>
              setWorkExperienceData({ ...WorkExperienceData, description: e.target.value })
            }
            value={WorkExperienceData.description}
          />
          <Button
            w="fit-content"
            onClick={() => {
              ResumeGeneratorForm.setFieldValue('workExperience', [
                ...ResumeGeneratorForm.values.workExperience,
                WorkExperienceData,
              ]);
              setWorkExperienceData({
                company: '',
                position: '',
                startDate: null,
                endDate: null,
                description: '',
              });
            }}
          >
            Add Work Experience
          </Button>
        </Fieldset>
        {ResumeGeneratorForm.values.workExperience.length > 0 &&
          ResumeGeneratorForm.values.workExperience.map((work) => (
            <Fieldset key={work.company} legend={work.company}>
              <TextInput label="Position" value={work.position} disabled />
              <TextInput
                label="Start Date"
                value={new Date(work.startDate as Date).toLocaleDateString()}
                disabled
              />
              <TextInput
                label="End Date"
                value={new Date(work.endDate as Date).toLocaleDateString()}
                disabled
              />
              <Textarea label="Description" value={work.description} disabled />
              <Group my="md" justify="space-between">
                <Button
                  onClick={() =>
                    ResumeGeneratorForm.setFieldValue(
                      'workExperience',
                      ResumeGeneratorForm.values.workExperience.filter((w) => w !== work)
                    )
                  }
                >
                  Delete
                </Button>
              </Group>
            </Fieldset>
          ))}
        <Fieldset
          legend="Education"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <TextInput
            label="Institution"
            placeholder="Institution Name"
            onChange={(e) => setEducationData({ ...EducationData, institution: e.target.value })}
            value={EducationData.institution}
          />
          <TextInput
            label="Degree"
            placeholder="Degree"
            onChange={(e) => setEducationData({ ...EducationData, degree: e.target.value })}
            value={EducationData.degree}
          />
          <DatePickerInput
            label="Start Date"
            placeholder="Start Date"
            value={EducationData.startDate}
            onChange={(date) => setEducationData({ ...EducationData, startDate: date })}
            rightSection={
              <IconX
                onClick={() => {
                  setEducationData({ ...EducationData, startDate: null });
                }}
              />
            }
          />
          <DatePickerInput
            label="End Date"
            placeholder="End Date"
            value={EducationData.endDate}
            onChange={(date) => setEducationData({ ...EducationData, endDate: date })}
            rightSection={
              <IconX
                onClick={() => {
                  setEducationData({ ...EducationData, endDate: null });
                }}
              />
            }
          />
          <Textarea
            label="Description"
            placeholder="Description"
            onChange={(e) => setEducationData({ ...EducationData, description: e.target.value })}
            value={EducationData.description}
          />
          <Button
            w="fit-content"
            onClick={() => {
              ResumeGeneratorForm.setFieldValue('education', [
                ...ResumeGeneratorForm.values.education,
                EducationData,
              ]);
              setEducationData({
                institution: '',
                degree: '',
                startDate: null,
                endDate: null,
                description: '',
              });
            }}
          >
            Add Education
          </Button>
        </Fieldset>
        {ResumeGeneratorForm.values.education.length > 0 &&
          ResumeGeneratorForm.values.education.map((edu) => (
            <Fieldset key={edu.institution} legend={edu.institution}>
              <TextInput label="Degree" value={edu.degree} disabled />
              <TextInput
                label="Start Date"
                value={new Date(edu.startDate as Date).toLocaleDateString()}
                disabled
              />
              <TextInput
                label="End Date"
                value={new Date(edu.endDate as Date).toLocaleDateString()}
                disabled
              />
              <Textarea label="Description" value={edu.description} disabled />
              <Group my="md" justify="space-between">
                <Button
                  onClick={() =>
                    ResumeGeneratorForm.setFieldValue(
                      'education',
                      ResumeGeneratorForm.values.education.filter((e) => e !== edu)
                    )
                  }
                >
                  Delete
                </Button>
              </Group>
            </Fieldset>
          ))}
        <Fieldset
          legend="Skills"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <TextInput
            label="Skill Name"
            placeholder="Skill Name"
            onChange={(e) => setSkillData({ ...SkillData, name: e.target.value })}
            value={SkillData.name}
          />
          <NativeSelect
            data={[
              { label: 'Beginner', value: 'Beginner' },
              { label: 'Intermediate', value: 'Intermediate' },
              { label: 'Advanced', value: 'Advanced' },
              { label: 'Expert', value: 'Expert' },
            ]}
            label="Skill Level"
            value={SkillData.level}
            onChange={(e) =>
              setSkillData({
                ...SkillData,
                level: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
              })
            }
          />
          <Button
            w="fit-content"
            onClick={() => {
              ResumeGeneratorForm.setFieldValue('skills', [
                ...ResumeGeneratorForm.values.skills,
                SkillData,
              ]);
              setSkillData({ name: '', level: 'Beginner' });
            }}
          >
            Add Skill
          </Button>
        </Fieldset>
        {ResumeGeneratorForm.values.skills.length > 0 &&
          ResumeGeneratorForm.values.skills.map((skill) => (
            <Fieldset key={skill.name} legend={skill.name}>
              <TextInput label="Skill Level" value={skill.level} disabled />
              <Group my="md" justify="space-between">
                <Button
                  onClick={() =>
                    ResumeGeneratorForm.setFieldValue(
                      'skills',
                      ResumeGeneratorForm.values.skills.filter((s) => s !== skill)
                    )
                  }
                >
                  Delete
                </Button>
              </Group>
            </Fieldset>
          ))}
        <Fieldset
          legend="Certifications"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <TextInput
            label="Certification Name"
            placeholder="Certification Name"
            onChange={(e) => setCertificationData({ ...CertificationData, name: e.target.value })}
            value={CertificationData.name}
          />
          <TextInput
            label="Institution"
            placeholder="Institution"
            onChange={(e) =>
              setCertificationData({ ...CertificationData, institution: e.target.value })
            }
            value={CertificationData.institution}
          />
          <Button
            w="fit-content"
            onClick={() => {
              ResumeGeneratorForm.setFieldValue('certifications', [
                ...ResumeGeneratorForm.values.certifications,
                CertificationData,
              ]);
              setCertificationData({ name: '', institution: '' });
            }}
          >
            Add Certification
          </Button>
        </Fieldset>
        {ResumeGeneratorForm.values.certifications.length > 0 &&
          ResumeGeneratorForm.values.certifications.map((cert) => (
            <Fieldset key={cert.name} legend={cert.name}>
              <TextInput label="Institution" value={cert.institution} disabled />
              <Group my="md" justify="space-between">
                <Button
                  onClick={() =>
                    ResumeGeneratorForm.setFieldValue(
                      'certifications',
                      ResumeGeneratorForm.values.certifications.filter((c) => c !== cert)
                    )
                  }
                >
                  Delete
                </Button>
              </Group>
            </Fieldset>
          ))}
        <Fieldset
          legend="Languages"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <TextInput
            label="Language Name"
            placeholder="Language Name"
            onChange={(e) => setLanguageData({ ...LanguageData, name: e.target.value })}
            value={LanguageData.name}
          />
          <NativeSelect
            data={[
              { label: 'Beginner', value: 'Beginner' },
              { label: 'Intermediate', value: 'Intermediate' },
              { label: 'Advanced', value: 'Advanced' },
              { label: 'Fluent', value: 'Fluent' },
              { label: 'Native', value: 'Native' },
            ]}
            label="Language Level"
            value={LanguageData.level}
            onChange={(e) =>
              setLanguageData({
                ...LanguageData,
                level: e.target.value as
                  | 'Beginner'
                  | 'Intermediate'
                  | 'Advanced'
                  | 'Fluent'
                  | 'Native',
              })
            }
          />
          <Button
            w="fit-content"
            onClick={() => {
              ResumeGeneratorForm.setFieldValue('languages', [
                ...ResumeGeneratorForm.values.languages,
                LanguageData,
              ]);
              setLanguageData({ name: '', level: 'Beginner' });
            }}
          >
            Add Language
          </Button>
        </Fieldset>
        {ResumeGeneratorForm.values.languages.length > 0 &&
          ResumeGeneratorForm.values.languages.map((lang) => (
            <Fieldset key={lang.name} legend={lang.name}>
              <TextInput label="Language Level" value={lang.level} disabled />
              <Group my="md" justify="space-between">
                <Button
                  onClick={() =>
                    ResumeGeneratorForm.setFieldValue(
                      'languages',
                      ResumeGeneratorForm.values.languages.filter((l) => l !== lang)
                    )
                  }
                >
                  Delete
                </Button>
              </Group>
            </Fieldset>
          ))}
        <Fieldset
          legend="Hobbies"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <TextInput
            label="Hobby"
            placeholder="Hobby"
            onChange={(e) => setHobbyData(e.target.value)}
            value={HobbyData}
          />
          <Button
            w="fit-content"
            onClick={() => {
              ResumeGeneratorForm.setFieldValue('hobbies', [
                ...ResumeGeneratorForm.values.hobbies,
                HobbyData,
              ]);
              setHobbyData('');
            }}
          >
            Add Hobby
          </Button>
        </Fieldset>
        {ResumeGeneratorForm.values.hobbies.length > 0 &&
          ResumeGeneratorForm.values.hobbies.map((hobby) => (
            <Fieldset key={hobby} legend={hobby}>
              <Group my="md" justify="space-between">
                <Button
                  onClick={() =>
                    ResumeGeneratorForm.setFieldValue(
                      'hobbies',
                      ResumeGeneratorForm.values.hobbies.filter((h) => h !== hobby)
                    )
                  }
                >
                  Delete
                </Button>
              </Group>
            </Fieldset>
          ))}
        <Fieldset
          legend="Work Samples"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <TextInput
            label="Name"
            placeholder="Name"
            onChange={(e) => setWorkSampleData({ ...WorkSampleData, name: e.target.value })}
            value={WorkSampleData.name}
          />
          <Textarea
            label="Description"
            placeholder="Description"
            onChange={(e) => setWorkSampleData({ ...WorkSampleData, description: e.target.value })}
            value={WorkSampleData.description}
          />
          <TextInput
            label="URL"
            placeholder="URL"
            onChange={(e) => setWorkSampleData({ ...WorkSampleData, url: e.target.value })}
            value={WorkSampleData.url}
          />
          <Group justify="space-between">
            <FileInput
              disabled={uploadHandle.isLoading}
              onChange={(value) =>
                uploadHandle.sendFile(
                  '/upload',
                  value as File,
                  'Image Uploaded Successfully!',
                  'Failed to upload image! Please try again.',
                  (url: string) => {
                    setWorkSampleData({ ...WorkSampleData, image: url });
                  }
                )
              }
              rightSection={uploadHandle.isLoading ? <Loader size="xs" /> : <IconFileLike />}
              label="Choose a Picture to Upload"
            />
            <div>
              <Image
                src={WorkSampleData.image !== '' ? WorkSampleData.image : blackBG}
                alt="Profile Picture"
                width={200}
                height={200}
                radius="xl"
                fit="contain"
              />
            </div>
          </Group>
          <TagsInput
            label="Technologies"
            placeholder="Technologies"
            onChange={(value) => setWorkSampleData({ ...WorkSampleData, technologies: value })}
            value={WorkSampleData.technologies}
            rightSection={
              <IconX
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setWorkSampleData({ ...WorkSampleData, technologies: [] });
                }}
              />
            }
          />
          <Button
            w="fit-content"
            onClick={() => {
              ResumeGeneratorForm.setFieldValue('workSamples', [
                ...ResumeGeneratorForm.values.workSamples,
                WorkSampleData,
              ]);
              setWorkSampleData({
                name: '',
                description: '',
                url: '',
                image: '',
                technologies: [],
              });
            }}
          >
            Add Work Sample
          </Button>
        </Fieldset>
        {ResumeGeneratorForm.values.workSamples.length > 0 &&
          ResumeGeneratorForm.values.workSamples.map((sample) => (
            <Fieldset
              key={sample.name}
              legend={sample.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <Group justify="space-between">
                <div>
                  <Textarea label="Description" value={sample.description} disabled />
                  <TextInput label="URL" value={sample.url} disabled />
                </div>
                <div>
                  <Image
                    src={sample.image !== '' ? sample.image : blackBG}
                    alt={sample.name}
                    width={100}
                    height={100}
                    radius="xl"
                    fit="contain"
                  />
                </div>
              </Group>

              <Button
                w="fit-content"
                onClick={() =>
                  ResumeGeneratorForm.setFieldValue(
                    'workSamples',
                    ResumeGeneratorForm.values.workSamples.filter((s) => s !== sample)
                  )
                }
              >
                Delete
              </Button>
            </Fieldset>
          ))}

        <Switch
          label="Available for Work"
          {...ResumeGeneratorForm.getInputProps('active')}
          defaultChecked={ResumeData?.active || false}
        />
        <Button
          w="fit-content"
          type="submit"
          loading={FormActions.isLoading}
          disabled={FormActions.isLoading}
        >
          Update Resume
        </Button>
      </Box>
    </Box>
  );
}

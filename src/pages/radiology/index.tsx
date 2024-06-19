"use client";
import React, { useState } from "react";
import { z, ZodType } from "zod";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import style from "./radiology.module.css";
import { RiDeleteBinLine } from "react-icons/ri";
import { useDropzone } from "react-dropzone";

// Define the TypeScript interface for a report
interface Report {
  testName: string;
  date: string;
  doctor: string;
  diagnosis: string;
  image?: File[];
}

// Define the TypeScript interface for form data
interface FormData {
  testName: string;
  date: string;
  doctor: string;
  diagnosis: string;
  image?: File[];
  addnewreport: Report[];
}

// Define the Zod schema for a report
const reportSchema = z.object({
  testName: z
    .string()
    .min(3, "Test name must be at least 3 characters long")
    .max(50, "Test name must be at most 50 characters long"),
  date: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Date is required",
    }),
  doctor: z
    .string()
    .min(3, "Doctor's name must be at least 3 characters long")
    .max(50, "Doctor's name must be at most 50 characters long"),
  diagnosis: z
    .string()
    .min(3, "Diagnosis must be at least 3 characters long")
    .max(50, "Diagnosis must be at most 50 characters long"),
    images: z.array(z.instanceof(File)).optional(),  // Validate image as a File object
});

// Define the Zod schema for form data
const schema: ZodType<FormData> = z.object({
  testName: z
    .string()
    .min(3, "Test name must be at least 3 characters long")
    .max(50, "Test name must be at most 50 characters long"),
  date: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Date is required",
    }),
  doctor: z
    .string()
    .min(3, "Doctor's name must be at least 3 characters long")
    .max(50, "Doctor's name must be at most 50 characters long"),
  diagnosis: z
    .string()
    .min(3, "Diagnosis must be at least 3 characters long")
    .max(50, "Diagnosis must be at most 50 characters long"),
    images: z.array(z.instanceof(File)).optional(),  // Validate image as a File object
  addnewreport: z.array(reportSchema), // Ensure this is always an array
});

// Styled components
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  
`;

const Input = styled.input`
  padding: 5px 5px 5px 38px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 86%;
  box-sizing: border-box;
  background-image: url("searchicon.png");
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: 18px 18px;
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 12px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 30px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ImagePreview = styled.img`
  position: relative;
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin: 5px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  margin-left: 10px;
`;

const DropzoneContainer = styled.div`
  border: 2px dashed #007bff;
  border-radius: 4px;
  padding: 7px;
  text-align: center;
  cursor: pointer;
  margin-top: 8px;
  margin-bottom: 8px;
  position: relative;
`;

const IconContainer = styled.div`
  font-size: 18px;
  color: #007bff;
  margin-bottom: 3px;
  display: flex;
  justify-content: center;
`;

const CustomImage = styled.img`
  width: 20px;
  height: 20px;
`;

const Radiology: React.FC = () => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      testName: "",
      date: "",
      doctor: "",
      diagnosis: "",
      addnewreport: [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addnewreport",
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const handleImageChange = (files: File[]) => {
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    methods.setValue("image", files);
  };

  const handleDeleteImage = () => {
    setImagePreviews([]);
    methods.setValue("image", undefined);
  };

  

  const handleSingleDelete = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    const newImages = methods.getValues("image")?.filter((_, i) => i !== index);
    methods.setValue("image", newImages);
  }

  // Dropzone hook for main image
  const { getRootProps: getRootPropsMain, getInputProps: getInputPropsMain } =
    useDropzone({
      onDrop: handleImageChange,
      accept: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "application/pdf": [".pdf"],
        "application/dicom": [".dicom"],
      },
      maxSize: 10485760, // 10MB
    });

  return (
    <div className={style.home}>
      <div className={style.addbtn}>
        <Button
          type="button"
          onClick={() =>
            append({ testName: "", date: "", doctor: "", diagnosis: "" })
          }
        >
          Add new report
        </Button>
      </div>
      <div className={style.container}>
        <div className={style.nav}>
          <FormProvider {...methods}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <div className={style.searchitem}>
                  <div>
                    <Input
                      id="testName"
                      {...register("testName")}
                      placeholder="Radiology Test Name"
                    />
                    {errors.testName && (
                      <ErrorMessage>{errors.testName?.message}</ErrorMessage>
                    )}
                  </div>
                  <div>
                    <Input
                      type="date"
                      id="date"
                      {...register("date")}
                      placeholder="Select Date"
                    />
                    {errors.date && (
                      <ErrorMessage>{errors.date?.message}</ErrorMessage>
                    )}
                  </div>
                  <div>
                    <Input
                      id="doctor"
                      {...register("doctor")}
                      placeholder="Performing Doctor"
                    />
                    {errors.doctor && (
                      <ErrorMessage>{errors.doctor?.message}</ErrorMessage>
                    )}
                  </div>
                  <div>
                    <Input
                      id="diagnosis"
                      {...register("diagnosis")}
                      placeholder="Add Diagnosis"
                    />
                    {errors.diagnosis && (
                      <ErrorMessage>{errors.diagnosis?.message}</ErrorMessage>
                    )}
                  </div>
                </div>
                <div className={style.btnsec}>
                  <RiDeleteBinLine
                    type="button"
                    onClick={handleDeleteImage}
                    className={style.deletebtn}
                  />
                  <IconButton type="button">📌</IconButton>
                </div>
              </FormGroup>

              <div
                className={
                  imagePreviews.length !== 0 ? style.folder : style.folderContentCenter
                }
              >
                {imagePreviews.length !== 0 && (
                  <div className={style.parentImgDiv}>
                    {imagePreviews.map((image, index) => {
                      return (
                        <div className={style.imageDiv} key={index}>
                          <ImagePreview src={image} alt="Preview" />
                          <div className={style.innerImgDiv} onClick={() => handleSingleDelete(index)}>&#8942;</div>
                        </div>
                      );
                    })}
                    <div className={style.plusdiv} {...getRootPropsMain()}>
                      +<input {...getInputPropsMain()} />
                    </div>
                  </div>
                )}
                {imagePreviews.length === 0 && (
                  <DropzoneContainer {...getRootPropsMain()}>
                    <input {...getInputPropsMain()} />
                    <IconContainer>
                      <CustomImage src="/upload.png" alt="Upload Icon" />
                    </IconContainer>
                    <p className={style.para}>
                      <b>Click to upload</b> or drag and drop
                    </p>
                    <p className={style.para}>
                      PNG, JPG or PDF Or DICON |MAX. Size 10 MB
                    </p>
                  </DropzoneContainer>
                )}
              </div>

              {fields.map((field, index) => (
                <ReportItem
                  key={field.id}
                  field={field}
                  index={index}
                  register={register}
                  errors={errors}
                  methods={methods}
                />
              ))}
              <Button type="submit">Submit</Button>
            </Form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};


interface ReportItemProps {
  field: Report;
  index: number;
  register: any;
  errors: any;
  methods: any;
}

const ReportItem: React.FC<ReportItemProps> = ({
  field,
  index,
  register,
  errors,
  methods
}) => {

  console.log(`methods ${methods}`)

  const [reportPreviews, setReportPreviews] = useState<string[]>([]);
  const handleReportImageChange = (files: File[], index: number) => {
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setReportPreviews((prev) => [...prev, ...newPreviews]);
    methods.setValue(`addnewreport.${index}.images`, files);
  };

  const handleDeleteReportImage = (index: number) => {
    setReportPreviews([])
    methods.setValue(`addnewreport.${index}.image`, undefined);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => handleReportImageChange(files, index),
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
      "application/dicom": [".dicom"],
    },
    maxSize: 10485760, // 10MB
  });
  const handleSingleDelete = (index: number) => {
    setReportPreviews(prev => prev.filter((_, i) => i !== index));
    const newImages = methods.getValues("image")?.filter((_:any, i:any) => i !== index);
    methods.setValue("image", newImages);
  }

  return (
    <div className={style.container1}>
      <div className={style.nav}>
        <FormGroup>
          <div className={style.searchitem}>
            <div>
              <Input
                id={`addnewreport.${index}.testName`}
                {...register(`addnewreport.${index}.testName`)}
                placeholder="Radiology Test Name"
              />
              {errors.addnewreport?.[index]?.testName && (
                <ErrorMessage>
                  {errors.addnewreport[index]?.testName?.message}
                </ErrorMessage>
              )}
            </div>
            <div>
              <Input
                type="date"
                id={`addnewreport.${index}.date`}
                {...register(`addnewreport.${index}.date`)}
                placeholder="Select Date"
              />
              {errors.addnewreport?.[index]?.date && (
                <ErrorMessage>
                  {errors.addnewreport[index]?.date?.message}
                </ErrorMessage>
              )}
            </div>
            <div>
              <Input
                id={`addnewreport.${index}.doctor`}
                {...register(`addnewreport.${index}.doctor`)}
                placeholder="Performing Doctor"
              />
              {errors.addnewreport?.[index]?.doctor && (
                <ErrorMessage>
                  {errors.addnewreport[index]?.doctor?.message}
                </ErrorMessage>
              )}
            </div>
            <div>
              <Input
                id={`addnewreport.${index}.diagnosis`}
                {...register(`addnewreport.${index}.diagnosis`)}
                placeholder="Add Diagnosis"
              />
              {errors.addnewreport?.[index]?.diagnosis && (
                <ErrorMessage>
                  {errors.addnewreport[index]?.diagnosis?.message}
                </ErrorMessage>
              )}
            </div>
          </div>
          <div className={style.btnsec}>
            <RiDeleteBinLine
              type="button"
              onClick={() => handleDeleteReportImage(index)}
              className={style.deletebtn}
            />
            <IconButton type="button">📌</IconButton>
          </div>
        </FormGroup>
      </div>
      <div className={
                  reportPreviews.length !== 0 ? style.folder : style.folderContentCenter
                }>
        {reportPreviews.length !==0 && (
                  <div className={style.parentImgDiv}>
                    {reportPreviews.length !==0 && reportPreviews.map((image, index) => {
                      return (
                        <div className={style.imageDiv} key={index}>
                          <ImagePreview src={image} alt="Preview" />
                          <div className={style.innerImgDiv} onClick={() => handleSingleDelete(index)}>&#8942;</div>
                        </div>
                      );
                    })}
                    <div className={style.plusdiv} {...getRootProps()}>
                      +<input {...getInputProps()} />
                    </div>
                  </div>
                )}
        { reportPreviews.length === 0 && <DropzoneContainer {...getRootProps()}>
          <input {...getInputProps()} />
          <IconContainer>
            <CustomImage src="/upload.png" alt="Upload Icon" />
          </IconContainer>
          <p className={style.para}>
            <b>Click to upload</b> or drag and drop
          </p>
          <p className={style.para}>
            PNG, JPG or PDF Or DICON |MAX. Size 10 MB
          </p>
        </DropzoneContainer>}
      </div>
    </div>
  );
};

export default Radiology;

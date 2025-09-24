import { Button, Container, Step, StepLabel, Stepper } from "@mui/material";
import React, { useState, useEffect } from "react";

const steps = ["Project Information", "Project Configuration", "Security Control", "Summary"];

const MultiStepForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    projectCode: "",
    decipline: "",
     mLModel: "",
     docType: "",
     projectPurpose: "",
       description: "",
      cadSystem: "",
      tolerance: "",
    maxArialGap: "",
      arrowSize: "",
     inputSpaceHeight: "",
   inputSpaceWidth: "",
      cadOutput:"",
     diameterSymbol: "",
     arrowBuffer: "",
     outputDrawingBorder: "",
     inputSpaceUnit: "",
endpointDistance: "",
gridSize: "",
securityLevel: "",
encryptionKey: "",
  });

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    console.log("Submitting form data:", formData);
    onSubmit(formData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.from(form).indexOf(e.target);
      if (form.elements[index + 1]) {
        form.elements[index + 1].focus();
      }
    }
  };


  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <form className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Project Name"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <input
                type="text"
                placeholder="Client Name"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <input
                type="number"
                placeholder="Project Code"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
                name="projectCode"
                value={formData.projectCode}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
               <select
              name="decipline"
              value={formData.decipline}
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              >
               <option value="decipline">Select Discipline</option>
               <option value="Process">Process</option>
              <option value="Development">Instrumentation</option>
              <option value="Research">Piping</option>
             <option value="Marketing">Civil</option>
              </select>
              
             
              <select
              name="mLModel"
                value={formData.MLModel}
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              >
               <option value="MLModel">ML Model</option>
               <option value="ML1">ML1</option>
              <option value="ML2">ML1</option>
              <option value="ML3">ML1</option>
             <option value="ML4">ML1</option>
              </select>
              <select
  name="docType"
  value={formData.docType}
  onChange={handleChange}
  required
  className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
>
  <option value="" >Select Document Type</option>
  <option value="pdf">PDF</option>
  <option value="image">Image</option>
  <option value="autocad">AutoCAD</option>
</select>
              <textarea
                placeholder="Project Purpose"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
                name="projectPurpose"
                rows={3}
                value={formData.projectPurpose}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              ></textarea>
              <textarea
                placeholder="Project Description"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              ></textarea>
            </div>
          </form>
        );
      case 1:
        return (
          <form className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select
                name="cadSystem"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
                value={formData.category}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              >
                <option value="">CAD System</option>
                <option value="Development">AutoCAD</option>
                <option value="Research">MicroStation</option>
                <option value="Marketing">SolidWorks</option>
              </select>

              <input
              name="tolerance"
                type="number"
                placeholder="Tolerance (px)"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
                value={formData.tolerance}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              >
               
              </input>
              <input
              name="maxArialGap"
                type="number"
                placeholder="Max Arial Gap (px)"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90e"
                value={formData.smaxArialGap}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
               <input
              name="arrowSize"
                type="number"
                placeholder="Arrow Size (px)"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90e"
                value={formData.arrowSize}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
                <input
              name="inputSpaceHeight"
                type="number"
                placeholder="Input Space Height (px)"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90e"
                value={formData.inputSpaceHeight}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
                
                <input
              name="inputSpaceWidth"
                type="number"
                placeholder="Input Space width (px)"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90e"
                value={formData.inputSpaceWidth}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
               <input
              name="cadOutput"
                type="number"
                placeholder="CAD output width UOM (inch)"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90e"
                value={formData.cadOutput}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
               <input
              name="diameterSymbol"
                type="number"
                placeholder="Diameter Symbol (mm)"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90e"
                value={formData.diameterSymbol}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
                <input
              name="arrowBuffer"
                type="number"
                placeholder="Arrow Buffer (px)"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90e"
                value={formData.arrowBuffer}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
                <input
              name="outputDrawingBorder"
                type="text"
                placeholder="Output Drawing Border"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90e"
                value={formData.outputDrawingBorder}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
               <input
              name="inputSpaceUnit"
                type="number"
                placeholder="Input Space Unit (px)"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90e"
                value={formData.inputSpaceUnit}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
               <input
              name="endpointDistance"
                type="number"
                placeholder="Endpoint Currection Distance (px)"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90e"
                value={formData.endpointDistance}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
               <input
              name="gridSize"
                type="number"
                placeholder="Grid Size"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90e"
                value={formData.gridSize}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
             
            </div>
          </form>
        );
      case 2:
        return (
          <form className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <textarea
                placeholder="Security Notes"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              ></textarea>
              <input
                type="text"
                placeholder="Security Level"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
                name="securityLevel"
                value={formData.securityLevel}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <input
                type="password"
                placeholder="Encryption Key"
                required
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
                name="encryptionKey"
                value={formData.encryptionKey}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </form>
        );
      case 3:
        return (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-bold mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key}
                className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90"
                 >
                  <strong>{key}:</strong> {value ? value.toString() : "N/A"}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return "Unknown Step";
    }
  };

  return (
    <Container maxWidth="md" className="m-4">
      <div className="mb-6">
        {/* <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel >{label}</StepLabel>
            </Step>
          ))}
        </Stepper> */}
        <Stepper activeStep={activeStep} alternativeLabel>
  {steps.map((label, index) => (
    <Step key={index}>
      <StepLabel
        sx={{
          // Circle (Step Icon)
          '& .MuiStepIcon-root': {
            color: '#9CA3AF', // Tailwind gray-400
            '.dark &': {
              color: '#4B5563', // Tailwind gray-600
            },
          },
          '& .Mui-active .MuiStepIcon-root': {
            color: '#2563EB', // Tailwind blue-600
            '.dark &': {
              color: '#3B82F6',
            },
          },
          '& .Mui-completed .MuiStepIcon-root': {
            color: '#16A34A', // Tailwind green-600
            '.dark &': {
              color: '#22C55E',
            },
          },

          // Circle number inside
          '& .MuiStepIcon-text': {
            fill: '#ffffff',
            fontWeight: 'bold',
            fontSize: '14px',
          },

          // Label text
          '& .MuiStepLabel-label': {
            fontSize: '0.875rem', // text-sm
            color: '#374151', // gray-700
            fontWeight: 500,
            '.dark &': {
              color: '#D1D5DB', // gray-300
            },
          },
          '& .Mui-active .MuiStepLabel-label': {
            color: '#2563EB',
            '.dark &': {
              color: '#3B82F6',
            },
          },
          '& .Mui-completed .MuiStepLabel-label': {
            color: '#16A34A',
            '.dark &': {
              color: '#22C55E',
            },
          },
        }}
      >
        {label}
      </StepLabel>
    </Step>
  ))}
</Stepper>

        
        
      </div>

      <div className="text-gray-700 dark:text-gray-400">{renderStepContent(activeStep)}</div>

      <div className="flex justify-end mt-6 gap-4">
  <Button
    disabled={activeStep === 0}
    onClick={handleBack}
    variant="outlined"
    className="!text-gray-700 dark:!text-white  dark:!border-gray-600"
  >
    Back
  </Button>
  <Button
    onClick={handleNext}
    variant="contained">
    {activeStep === steps.length - 1 ? "Submit" : "Next"}
  </Button>
</div>

    </Container>
  );
};

export default MultiStepForm;


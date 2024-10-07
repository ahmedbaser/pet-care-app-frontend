import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const PetNutritionCalculator: React.FC = () => {
  const [age, setAge] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text('Pet Nutrition Chart', 10, 10);
    doc.text(`Age: ${age} years`, 10, 20);
    doc.text(`Weight: ${weight} kg`, 10, 30);
    doc.text('Recommended Nutrition:', 10, 40);
    doc.text('Daily Calories: ...', 10, 50);
    // Add more recommendations here
    doc.save('pet-nutrition-chart.pdf');
  };

  return (
    <div className="nutrition-calculator">
      <h2>Pet Nutrition Calculator</h2>
      <form>
        <label>
          Pet Age (years):
          <input
            type="number"
            value={age || ''}
            onChange={(e) => setAge(parseInt(e.target.value))}
            required
          />
        </label>
        <label>
          Pet Weight (kg):
          <input
            type="number"
            value={weight || ''}
            onChange={(e) => setWeight(parseInt(e.target.value))}
            required
          />
        </label>
        <button type="button" onClick={handleGeneratePDF}>Generate PDF</button>
      </form>
    </div>
  );
};

export default PetNutritionCalculator;

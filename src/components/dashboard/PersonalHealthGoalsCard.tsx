import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { HealthGoal } from '../../types';
import {
  Droplets,
  Footprints,
  Activity,
  Moon,
  Plus,
  Minus,
  CheckCircle2,
  Trophy,
  Sparkles,
  Flame,
  X,
  Target,
  Edit3,
} from 'lucide-react';

export const PersonalHealthGoalsCard: React.FC = () => {
  const { goals, updateGoalProgress, setGoalValue, addHealthGoal } = useHealth();

  const [editingGoal, setEditingGoal] = useState<HealthGoal | null>(null);
  const [customValueInput, setCustomValueInput] = useState<string>('');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  // New goal form state
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<'water' | 'steps' | 'sleep' | 'exercise' | 'custom'>('custom');
  const [newGoalTarget, setNewGoalTarget] = useState<number>(30);
  const [newGoalUnit, setNewGoalUnit] = useState('mins');
  const [newGoalIncrement, setNewGoalIncrement] = useState<number>(5);
  const [newGoalNotes, setNewGoalNotes] = useState('');

  // Overall completion calculation
  const completedCount = goals.filter((g) => g.currentValue >= g.targetValue).length;
  const averageProgress = Math.round(
    goals.reduce((acc, g) => acc + Math.min(100, (g.currentValue / g.targetValue) * 100), 0) /
      (goals.length || 1)
  );

  const getGoalIcon = (category: string) => {
    switch (category) {
      case 'water':
        return <Droplets className="w-5 h-5 text-cyan-600" />;
      case 'steps':
        return <Footprints className="w-5 h-5 text-emerald-600" />;
      case 'exercise':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'sleep':
        return <Moon className="w-5 h-5 text-indigo-500" />;
      default:
        return <Target className="w-5 h-5 text-teal-600" />;
    }
  };

  const getProgressColor = (category: string, isDone: boolean) => {
    if (isDone) return 'bg-emerald-500';
    switch (category) {
      case 'water':
        return 'bg-cyan-500';
      case 'steps':
        return 'bg-teal-500';
      case 'exercise':
        return 'bg-amber-500';
      case 'sleep':
        return 'bg-indigo-500';
      default:
        return 'bg-teal-600';
    }
  };

  const handleOpenEdit = (goal: HealthGoal) => {
    setEditingGoal(goal);
    setCustomValueInput(String(goal.currentValue));
  };

  const handleSaveCustomValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal) return;
    const val = parseFloat(customValueInput);
    if (!isNaN(val)) {
      setGoalValue(editingGoal.id, val);
    }
    setEditingGoal(null);
  };

  const handleCreateNewGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName.trim() || newGoalTarget <= 0) return;

    addHealthGoal({
      name: newGoalName.trim(),
      category: newGoalCategory,
      currentValue: 0,
      targetValue: newGoalTarget,
      unit: newGoalUnit.trim(),
      stepIncrement: newGoalIncrement || 1,
      notes: newGoalNotes.trim() || undefined,
    });

    setShowAddGoalModal(false);
    setNewGoalName('');
    setNewGoalTarget(30);
    setNewGoalNotes('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
      {/* Header with visual aggregate progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-base tracking-tight">
              Personal Health & Daily Vitals Goals
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track daily hydration, physical mobility, sleep, and cardiovascular targets recommended by your care team.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Overall Completion Metric */}
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900">
              {completedCount} of {goals.length} Targets Met
            </div>
            <div className="text-[11px] font-mono text-teal-700 font-semibold">
              {averageProgress}% Daily Aggregate
            </div>
          </div>

          <button
            onClick={() => setShowAddGoalModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-xl border border-teal-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Target</span>
          </button>
        </div>
      </div>

      {/* Grid of Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
          const isDone = goal.currentValue >= goal.targetValue;

          return (
            <div
              key={goal.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Title & Category Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      {getGoalIcon(goal.category)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">
                        {goal.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Target: {goal.targetValue.toLocaleString()} {goal.unit} / day
                      </p>
                    </div>
                  </div>

                  {/* Target Status Indicator */}
                  {isDone ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-mono shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Goal Reached
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenEdit(goal)}
                      className="text-slate-400 hover:text-slate-700 p-1"
                      title="Edit exact value"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Progress Bar & Numeric Readout */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="flex items-baseline justify-between text-xs">
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {goal.currentValue.toLocaleString()}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        / {goal.targetValue.toLocaleString()} {goal.unit}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-xs font-bold ${
                        isDone ? 'text-emerald-700' : 'text-slate-700'
                      }`}
                    >
                      {percent}%
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor(
                        goal.category,
                        isDone
                      )}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Clinical Notes if available */}
                {goal.notes && (
                  <p className="text-[11px] text-slate-600 mt-2.5 leading-snug line-clamp-1 italic">
                    "{goal.notes}"
                  </p>
                )}
              </div>

              {/* Quick Action Controls */}
              <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-mono">
                  {goal.lastUpdated || 'Today'}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateGoalProgress(goal.id, -goal.stepIncrement)}
                    disabled={goal.currentValue <= 0}
                    className="p-1 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 disabled:opacity-40 rounded-lg border border-slate-200 transition-colors"
                    title={`Subtract ${goal.stepIncrement} ${goal.unit}`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => updateGoalProgress(goal.id, goal.stepIncrement)}
                    className="px-2.5 py-1 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>
                      +{goal.stepIncrement} {goal.unit}
                    </span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(goal)}
                    className="text-[11px] text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 transition-colors"
                  >
                    Set
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Value Modal */}
      {editingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">
                Log {editingGoal.name}
              </h4>
              <button
                onClick={() => setEditingGoal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomValue} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Current Amount ({editingGoal.unit}):
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={customValueInput}
                  onChange={(e) => setCustomValueInput(e.target.value)}
                  className="w-full text-sm font-mono p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="text-[11px] text-slate-500">
                Daily Target: {editingGoal.targetValue} {editingGoal.unit}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingGoal(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Update Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-base">
                Create Personal Health Target
              </h4>
              <button
                onClick={() => setShowAddGoalModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewGoal} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Goal Title:</label>
                <input
                  type="text"
                  required
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="e.g. Mindful Breathing, Sodium Limit, Stair Climbing"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Category:</label>
                  <select
                    value={newGoalCategory}
                    onChange={(e) => setNewGoalCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="water">Hydration (Water)</option>
                    <option value="steps">Step Count</option>
                    <option value="exercise">Aerobic Exercise</option>
                    <option value="sleep">Restful Sleep</option>
                    <option value="custom">Other Custom Metric</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Target Value / Day:</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Unit of Measurement:</label>
                  <input
                    type="text"
                    required
                    value={newGoalUnit}
                    onChange={(e) => setNewGoalUnit(e.target.value)}
                    placeholder="e.g. ml, steps, mins, hrs"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Quick Increment (+ button):</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newGoalIncrement}
                    onChange={(e) => setNewGoalIncrement(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Clinical Guidance / Note (Optional):</label>
                <textarea
                  rows={2}
                  value={newGoalNotes}
                  onChange={(e) => setNewGoalNotes(e.target.value)}
                  placeholder="e.g. Prescribed by Dr. Vasquez for metabolic wellness..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl"
                >
                  Add Daily Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

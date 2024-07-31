import { AbstractControl, ControlContainer } from '@angular/forms'

/**
 * Finds a form control explicitly or by name from the ControlContainer.
 *
 * @param controlName An form control name, as passed with the formControlName directive
 * @param controlContainer The Directive’s ControlContainer
 */
export const findFormControl = (controlName?: string, controlContainer?: ControlContainer): AbstractControl => {
  if (!controlName) {
    throw new Error('getFormControl: control or control name must be given');
  }
  if (!(controlContainer && controlContainer.control)) {
    throw new Error(
      'getFormControl: control name was given but parent control not found',
    );
  }
  const control = controlContainer.control.get(controlName);
  if (!control) {
    throw new Error(`getFormControl: control '${controlName}' not found`);
  }
  return control;
};
